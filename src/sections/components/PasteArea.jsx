import React, { useEffect, useRef, useState } from 'react'
import { Flex, Text, Button } from '@chakra-ui/react'
import { ImageUp } from 'lucide-react'

export const PasteArea = ({ index, change, handlePaste, handleRemoveImage, handlePreviewImage }) => {
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
        borderRadius: '6px',
        border: `2px dashed ${focused ? '#3182ce' : '#cbd5e0'}`,
        background: focused ? 'rgba(49,130,206,0.05)' : 'transparent',
        padding: hasImages ? '12px' : '24px 16px',
        textAlign: 'center',
        outline: 'none',
        cursor: 'default',
        transition: 'border-color 0.15s, background 0.15s',
        flex: 1
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
            <div
              key={imgIndex}
              style={{
                position: 'relative',
                display: 'inline-block',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                border: '1px solid #3b82f6',
                cursor: 'pointer',
                transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                transformOrigin: 'center center',
                willChange: 'transform',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.045)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.22)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.15)';
              }}
            >
              <button
                type="button"
                onClick={() => handlePreviewImage(src, `Preview ${imgIndex + 1}`)}
                style={{
                  display: 'block',
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'zoom-in',
                }}

                aria-label={`Ver imagen ${imgIndex + 1} en grande`}
              >
                <img src={src} alt={`Preview ${imgIndex + 1}`} style={{ maxWidth: '180px', maxHeight: '160px', display: 'block', objectFit: 'cover' }} />
              </button>
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
