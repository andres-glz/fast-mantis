import { Button, Field, Flex, Heading, HStack, Textarea, VStack } from '@chakra-ui/react'
import { GripVertical, X } from 'lucide-react'
import React, { useRef, useState } from 'react'

export const ChangesSection = ({ changes, setChanges }) => {
  const dragIndex = useRef(null);
  const [draggingOver, setDraggingOver] = useState(null);

  const handleDragStart = (index) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggingOver(index);
  };

  const handleDrop = (index) => {
    if (dragIndex.current === null || dragIndex.current === index) {
      setDraggingOver(null);
      return;
    }
    const reordered = [...changes];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);
    setChanges(reordered);
    dragIndex.current = null;
    setDraggingOver(null);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDraggingOver(null);
  };

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

  const handleRemoveChange = (index) => {
    setChanges(changes.filter((_, i) => i !== index));
  };

  return (
    <Flex borderWidth="1px" borderRadius="md" p={4} gap={6} flexDirection={'column'}>
      <Heading size="md" mb={2}>Cambios realizados</Heading>

      {changes.map((change, index) => (
        <VStack
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          style={{
            opacity: dragIndex.current === index ? 0.4 : 1,
            outline: draggingOver === index ? '2px dashed #3182ce' : 'none',
            borderRadius: '6px',
            transition: 'outline 0.1s',
          }}
        >
          <HStack w="full" alignItems="flex-start">
            <Flex alignSelf="flex-end" mb={2} cursor="grab" color="gray.400">
              <GripVertical size={18} />
            </Flex>
            <Field.Root flex={1}>
              <Field.Label>Cambio {index + 1}</Field.Label>
              <Textarea autoresize value={change.description} onChange={(e) => setChanges(changes.map((c, i) => i === index ? { ...c, description: e.target.value } : c))} />
            </Field.Root>
            <Button
              variant="ghost"
              colorPalette="red"
              size="sm"
              mt={6}
              disabled={changes.length === 1}
              onClick={() => handleRemoveChange(index)}
              aria-label="Eliminar cambio"
            >
              <X />
            </Button>
          </HStack>
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
        <Button onClick={() => setChanges([...changes, { description: "", images: [] }])} variant={'outline'}>Agregar cambio</Button>
      </Flex>
    </Flex>
  )
}
