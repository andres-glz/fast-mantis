import React from 'react'
import { Box, Heading, HStack, Button, Input, InputGroup, Field, NativeSelect, Flex } from '@chakra-ui/react'
import { Plus, X } from 'lucide-react'
//CONSTANTES
import { TYPES_COMPONENTS } from '../constants/COMPONENT_TYPES'

export const OtherComponents = ({ otherComponents, updateOtherComponent, addOtherComponent, removeOtherComponent }) => {
    return (
        <>
            <Box borderWidth="1px" borderRadius="md" p={4}>
                <Heading size="md" mb={4}>Componentes</Heading>
                {otherComponents.map((comp, index) => (
                    <HStack key={index} mb={3} gap={3} alignItems="flex-end">
                        <Field.Root flex={1}>
                            { index === 0 && <Field.Label>Tipo</Field.Label> }
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    placeholder="Seleccionar tipo"
                                    value={comp.type?.value || ""}
                                    onChange={(e) => updateOtherComponent(index, 'type', { label: e.target.selectedOptions[0].text, value: e.target.value })}
                                >
                                    {TYPES_COMPONENTS.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                    ))}
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Field.Root>
                        <Field.Root flex={2}>
                            { index === 0 && <Field.Label>Nombre</Field.Label> }
                            <Input
                                value={comp.componente}
                                placeholder='Nombre del componente'
                                onChange={(e) => updateOtherComponent(index, 'componente', e.target.value)}
                            />
                        </Field.Root>
                        <Field.Root flex={1}>
                            { index === 0 && <Field.Label>Versión</Field.Label> }
                            <Input
                                placeholder='1.0.0'
                                value={comp.version}
                                onChange={(e) => updateOtherComponent(index, 'version', e.target.value)}
                            />
                        </Field.Root>
                        <Button
                            variant="ghost"
                            colorPalette="red"
                            size="sm"
                            mb={1}
                            width="32px"
                            disabled={otherComponents.length === 1}
                            onClick={() => removeOtherComponent(index)}
                            aria-label="Eliminar componente"
                        >
                            <X />
                        </Button>
                    </HStack>
                ))}
                <Flex justifyContent="flex-end">
                    <Button onClick={addOtherComponent} variant={'outline'}><Plus /> Agregar</Button>
                </Flex>
            </Box>


        </>
    )
}
