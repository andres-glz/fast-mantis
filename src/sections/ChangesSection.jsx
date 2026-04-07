import { Button, Field, Flex, Heading, Textarea, VStack } from '@chakra-ui/react'
import React from 'react'

export const ChangesSection = ({ changes, setChanges }) => {

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // data URL
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePaste = async (e, index) => {
    const files = Array.from(e.clipboardData.items)
      .filter((x) => x.type.startsWith("image/"))
      .map((x) => x.getAsFile())
      .filter(Boolean);

    if (!files.length) return;

    const dataUrls = await Promise.all(files.map(fileToDataUrl));

    const newChanges = [...changes];
    newChanges[index] = {
      ...newChanges[index],
      images: [...(newChanges[index].images || []), ...dataUrls],
    };
    setChanges(newChanges);
  };

  const handleRemoveImage = (changeIndex, imgIndex) => {
    const newChanges = [...changes];
    const updatedImages = newChanges[changeIndex].images.filter((_, i) => i !== imgIndex);
    newChanges[changeIndex] = { ...newChanges[changeIndex], images: updatedImages };
    setChanges(newChanges);
  };

  return (
    <Flex borderWidth="1px" borderRadius="md" p={4} gap={6} flexDirection={'column'}>
      <Heading size="md" mb={2}>Cambios realizados</Heading>

      {changes.map((change, index) => (
        <VStack key={index} >
          <Field.Root>
            <Field.Label>Cambio {index + 1}</Field.Label>
            <Textarea autoresize value={change.description} onChange={(e) => setChanges(changes.map((c, i) => i === index ? { ...c, description: e.target.value } : c))} />
          </Field.Root>
          <div onPaste={e => handlePaste(e, index)} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
            <p>Haz clic aquí y presiona Ctrl + V para pegar una imagen</p>

            {change.images && change.images.length > 0 && (
              <Flex gap={2} flexWrap="wrap" justify="center" mt={2}>
                {change.images.map((src, imgIndex) => (
                  <div key={imgIndex} style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={src} alt={`Preview ${imgIndex + 1}`} style={{ maxWidth: '200px', display: 'block', margin: '0 auto' }} />
                    <Button
                      size="xs"
                      variant="solid"
                      colorPalette="red"
                      style={{ position: 'absolute', top: 2, right: 2 }}
                      onClick={() => handleRemoveImage(index, imgIndex)}
                    >✕</Button>
                  </div>
                ))}
              </Flex>
            )}
          </div>
        </VStack>
      ))}
      <Flex justifyContent="flex-end">
        <Button onClick={() => setChanges([...changes, { description: "", images: null }])} variant={'outline'}>Agregar cambio</Button>
      </Flex>
    </Flex>
  )
}
