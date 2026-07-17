import { Button, Field, Flex, Heading, HStack, Text, Textarea, VStack } from '@chakra-ui/react'
import { GripVertical, Plus, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { PasteArea } from './components/PasteArea'
import { ChangeOptions } from './components/ChangeOptions'

export const ChangesSection = ({ changes, setChanges }) => {
  const dragIndex = useRef(null);
  const itemRefs = useRef([]);
  const [draggingOver, setDraggingOver] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPreviewImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const handleDragEnd = (index) => {
    if (itemRefs.current[index]) {
      itemRefs.current[index].draggable = false;
    }
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

  const handlePreviewImage = (src, alt) => {
    setPreviewImage({ src, alt });
  };

  return (
    <>
      <Flex borderWidth="1px" borderRadius="md" p={4} gap={6} flexDirection={'column'} mt={2}>
        <Heading size="md" mb={2}>Cambios realizados</Heading>

        {changes.map((change, index) => (
          <VStack
            key={index}
            ref={(el) => { itemRefs.current[index] = el; }}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={() => handleDragEnd(index)}
            style={{
              opacity: dragIndex.current === index ? 0.4 : 1,
              outline: draggingOver === index ? '2px dashed #3182ce' : 'none',
              borderRadius: '6px',
              transition: 'outline 0.1s',
            }}
          >
            <HStack w="full" alignItems="flex-start">
              <Flex
                alignSelf="flex-end"
                mb={2}
                cursor="grab"
                color="gray.400"
                onMouseDown={() => {
                  if (itemRefs.current[index]) {
                    itemRefs.current[index].draggable = true;
                  }
                }}
                onMouseUp={() => {
                  if (itemRefs.current[index]) {
                    itemRefs.current[index].draggable = false;
                  }
                }}
              >
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
                width="32px"
                disabled={changes.length === 1}
                onClick={() => handleRemoveChange(index)}
                aria-label="Eliminar cambio"
              >
                <X />
              </Button>
            </HStack>
            <HStack w="full" alignItems="stretch" spacing={10}>
              <ChangeOptions change={change} onChange={(newData) => setChanges(changes.map((c, i) => i === index ? { ...c, ...newData } : c))} />
              <PasteArea
                index={index}
                change={change}
                handlePaste={handlePaste}
                handleRemoveImage={handleRemoveImage}
                handlePreviewImage={handlePreviewImage}
              />
            </HStack>
          </VStack>
        ))}
        <Flex justifyContent="flex-end">
          <Button onClick={() => setChanges([...changes, { description: "", images: [], showInPM: true, showInPDF: true, showInCommit: true }])} variant={'outline'}><Plus />Agregar</Button>
        </Flex>
      </Flex>

      {previewImage && (
        <Flex
          position="fixed"
          inset={0}
          zIndex={1400}
          align="center"
          justify="center"
          bg="rgba(0, 0, 0, 0.72)"
          p={4}
          onClick={() => setPreviewImage(null)}
        >
          <Flex
            position="relative"
            maxW="92vw"
            maxH="92vh"
            bg="white"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="blue.600"
            boxShadow="2xl"
            onClick={(e) => e.stopPropagation()}
            direction="column"
            gap={3}
          >
            <Button
              position="absolute"
              top={2}
              right={2}
              size="sm"
              variant='subtle'
              colorPalette="blue"
              onClick={() => setPreviewImage(null)}
              aria-label="Cerrar vista previa"
            >
              <X />
            </Button>
            <img
              src={previewImage.src}
              alt={previewImage.alt}
              style={{
                display: 'block',
                maxWidth: 'min(92vw, 1100px)',
                maxHeight: '82vh',
                objectFit: 'contain',
                borderRadius: '12px',
              }}
            />
          </Flex>
        </Flex>
      )}
    </>
  )
}
