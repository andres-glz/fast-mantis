import React from 'react'
import { Box, Heading, HStack, Button, Input, InputGroup, Field, NativeSelect, Flex } from '@chakra-ui/react'
import { Plus, X } from 'lucide-react'
//CONSTANTES
import { TYPES_COMPONENTS } from '../constants/COMPONENT_TYPES'
import { PRINT_FORMATS } from '../constants/PRINT_FORMATS'
import { STORE_PROCEDURES } from '../constants/STORE_PROCEDURES'
import { TEMPLATES } from '../constants/TEMPLATES'

const SUGGESTIONS_BY_TYPE = {
    formato_impresion: [...new Set(PRINT_FORMATS)],
    store_procedure: [...new Set(STORE_PROCEDURES)],
    template: [...new Set(TEMPLATES)],
}

function getSuggestionsForType(type) {
    return SUGGESTIONS_BY_TYPE[type] || []
}

export const OtherComponents = ({ otherComponents, updateOtherComponent, addOtherComponent, removeOtherComponent }) => {
    return (
        <>
            <Box borderWidth="1px" borderRadius="md" p={4}>
                <Heading size="md" mb={4}>Componentes</Heading>
                {otherComponents.map((comp, index) => {
                    const suggestions = getSuggestionsForType(comp.type?.value)
                    const datalistId = `other-component-suggestions-${index}`

                    return (
                    <HStack key={index} mb={3} gap={3} alignItems="flex-end">
                        <Field.Root flex={2}>
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
                        <Field.Root flex={3}>
                            { index === 0 && <Field.Label>Nombre</Field.Label> }
                            <Input
                                value={comp.name}
                                list={suggestions.length > 0 ? datalistId : undefined}
                                placeholder='Nombre del componente'
                                onChange={(e) => updateOtherComponent(index, 'name', e.target.value)}
                            />
                            {suggestions.length > 0 && (
                                <datalist id={datalistId}>
                                    {suggestions.map((suggestion) => (
                                        <option key={suggestion} value={suggestion} />
                                    ))}
                                </datalist>
                            )}
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
                    )
                })}
                <Flex justifyContent="flex-end">
                    <Button onClick={addOtherComponent} variant={'outline'}><Plus /> Agregar</Button>
                </Flex>
            </Box>


        </>
    )
}
