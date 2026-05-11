import { Button, Field, Flex, Heading, HStack, Text, Textarea, VStack } from '@chakra-ui/react'
import { GripVertical, ImageUp, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const PasteArea = ({ index, change, handlePaste, handleRemoveImage }) => {
  const [focused, setFocused] = useState(false);
  const areaRef = useRef(null);
  const hasImages = change.images && change.images.length > 0;

  useEffect(() => {
    if (!hasImages && areaRef.current === document.activeElement) {
      areaRef.current.blur();
    }
  }, [hasImages]);

  return (
    <div
      ref={areaRef}
      onPaste={e => handlePaste(e, index)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocused(false);
        }
      }}
      tabIndex={0}
      style={{
        width: '100%',
        borderRadius: '8px',
        border: `2px dashed ${focused ? '#3182ce' : '#cbd5e0'}`,
        background: focused ? 'rgba(49,130,206,0.05)' : 'transparent',
        padding: hasImages ? '12px' : '24px 16px',
        textAlign: 'center',
        outline: 'none',
        cursor: 'default',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      {!hasImages && (
        <Flex direction="column" align="center" gap={1} color={focused ? 'blue.400' : 'gray.400'} pointerEvents="none">
          <ImageUp size={24} />
          <Text fontSize="sm">Haz clic aquí y presiona Ctrl + V para pegar una imagen</Text>
        </Flex>
      )}
      {hasImages && (
        <Flex gap={3} flexWrap="wrap" justify="center">
          {change.images.map((src, imgIndex) => (
            <div key={imgIndex} style={{ position: 'relative', display: 'inline-block', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
              <img src={src} alt={`Preview ${imgIndex + 1}`} style={{ maxWidth: '180px', maxHeight: '160px', display: 'block', objectFit: 'cover' }} />
              <Button
                size="xs"
                variant="solid"
                colorPalette="red"
                style={{ position: 'absolute', top: 4, right: 4, borderRadius: '50%', minWidth: '22px', height: '22px', padding: 0 }}
                onClick={() => handleRemoveImage(index, imgIndex)}
              >✕</Button>
            </div>
          ))}
        </Flex>
      )}
    </div>
  );
};

export const ChangesSection = ({ changes, setChanges }) => {
  const dragIndex = useRef(null);
  const itemRefs = useRef([]);
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

  return (
    <Flex borderWidth="1px" borderRadius="md" p={4} gap={6} flexDirection={'column'}>
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
              disabled={changes.length === 1}
              onClick={() => handleRemoveChange(index)}
              aria-label="Eliminar cambio"
            >
              <X />
            </Button>
          </HStack>
          <PasteArea index={index} change={change} handlePaste={handlePaste} handleRemoveImage={handleRemoveImage} />
        </VStack>
      ))}
      <Flex justifyContent="flex-end">
        <Button onClick={() => setChanges([...changes, { description: "", images: [] }])} variant={'outline'}>Agregar cambio</Button>
      </Flex>
    </Flex>
  )
}
