const MAX_WORDS = 450; // stay safely under MyMemory's 500-word limit

/**
 * Translates a single chunk of text (must be under MAX_WORDS words).
 * @param {string} chunk
 * @returns {Promise<string>}
 */
async function translateChunk(chunk) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=es|en`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const json = await response.json();

    if (json.responseStatus === 200 && json.responseData?.translatedText) {
        return json.responseData.translatedText;
    }

    throw new Error(`Translation API error: ${json.responseDetails}`);
}

/**
 * Splits text into chunks where each chunk stays under MAX_WORDS words.
 * Splits on line boundaries to preserve bullet structure.
 * @param {string} text
 * @returns {string[]}
 */
function splitIntoChunks(text) {
    const lines = text.split('\n');
    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;

    for (const line of lines) {
        const lineWordCount = line.trim().split(/\s+/).filter(Boolean).length;

        if (currentWordCount + lineWordCount > MAX_WORDS && currentChunk.length > 0) {
            chunks.push(currentChunk.join('\n'));
            currentChunk = [];
            currentWordCount = 0;
        }

        currentChunk.push(line);
        currentWordCount += lineWordCount;
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n'));
    }

    return chunks;
}

/**
 * Translates text from Spanish to English using the MyMemory free API.
 * Automatically splits texts longer than MAX_WORDS words into chunks.
 * @param {string} text - Text to translate
 * @returns {Promise<string>} - Translated text, or original if translation fails
 */
export async function translateToEnglish(text) {
    if (!text || !text.trim()) return text;

    try {
        const chunks = splitIntoChunks(text);
        const translatedChunks = await Promise.all(chunks.map(translateChunk));
        return translatedChunks.join('\n');
    } catch (error) {
        console.warn("Translation failed, using original text:", error);
        return text;
    }
}
