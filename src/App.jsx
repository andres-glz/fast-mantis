import React, { useState } from 'react'
import { Box, Button, Container, Flex, Heading, HStack, InputGroup, Stack, Switch, Textarea, Field, Input, NativeSelect } from '@chakra-ui/react'
import { ColorModeButton } from './components/ui/color-mode'
import { Toaster, toaster } from '@/components/ui/toaster'
import { LuCheck, LuCopy } from 'react-icons/lu'
import { BrushCleaning, GitCommitVertical, TextAlignJustify, Save, Terminal, Trash2, X, FileText, ReceiptText } from 'lucide-react'

//PDF
import { PDFViewerContainer } from './pdf/PDFViewerContainer'

//COMPONENTS
import { ChangesSection } from './sections/ChangesSection'

//GENERATORS
import { generateCommit } from './generators/generateCommit'
import { generateCommitGit } from './generators/generateCommitGit'
import { generatePM } from './generators/generatePM'

//HOOKS
import { useMantisForm } from './hooks/useMantisForm'

//CONSTANTES
import { TIPOS_MANTIS } from './constants/TIPOS_MANTIS'
import { generateMarkdown } from './generators/generateMarkdown'

export const App = () => {
    const {
        state,
        setField,
        toggleSection,
        setSectionSwitch,
        setSectionValue,
        updateComponent,
        addComponent,
        removeComponent,
        reset,
        saveProgress,
        obtenerDatos,
    } = useMantisForm();

    // UI-only state — not persisted, not part of form logic
    const [isCopy, setIsCopy] = useState(false);
    const [isCopyGitTitle, setIsCopyGitTitle] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [pdfData, setPdfData] = useState(null);

    function copyOutput() {
        navigator.clipboard.writeText(state.output).then(() => {
            setIsCopy(true);
            toaster.create({
                description: `Copiado al portapapeles`,
                type: "success",
                closable: true,
                duration: 1500,
            });
            setTimeout(() => setIsCopy(false), 1500);
        });
    }

    function copyGitCommit() {
        navigator.clipboard.writeText(state.gitCommitTitle.value).then(() => {
            setIsCopyGitTitle(true);
            toaster.create({
                description: `Git Commit Title copiado al portapapeles`,
                type: "success",
                closable: true,
                duration: 1500,
            });
            setTimeout(() => setIsCopyGitTitle(false), 1500);
        });
    }

    function handleSave() {
        saveProgress();
        setIsSaved(true);
        toaster.create({
            description: `Progreso guardado`,
            type: "success",
            closable: true,
            duration: 1500,
        });
        setTimeout(() => setIsSaved(false), 1500);
    }

    async function handleGenerateCommitGit() {
        setSectionSwitch('gitCommitTitle', true);
        setSectionValue('gitCommitTitle', generateCommitTitle());
        setField('output', await generateCommitGit(obtenerDatos()));
    }

    function generateCommitTitle() {
        const data = obtenerDatos();
        
        const feat = TIPOS_MANTIS.find(t => t.title === data.tipoMantis)?.value || 'feat';
        const sprint = data.sprintEnabled ? `S${data.sprint}` : data.components.length > 0 ? `${data.components[0].componente || ''}` : '';
        const mantis = data.wp ? `WP-${data.wp}` : '';
        const jira = data.jira || mantis || '';
        const jiraPrefix = jira ? `[${jira}] ` : '';
        const title = data.jiraTitle || data.brief || data.title || '';
        
        return `${feat}(${sprint}): ${jiraPrefix}${title}`;
    }

    function handleGenerateMarkdown() {
        setSectionSwitch('gitCommitTitle', false);
        setField('output', generateMarkdown(obtenerDatos()));
    }

    function handleGenerateCommit() {
        setSectionSwitch('gitCommitTitle', false);
        setField('output', generateCommit(obtenerDatos()));
    }

    function handleGeneratePM() {
        setSectionSwitch('gitCommitTitle', false);
        setField('output', generatePM(obtenerDatos()));
    }

    function handleGeneratePDF() {
        setPdfData({ ...obtenerDatos() });
    }

    function handleReset() {
        reset();
        setPdfData(null);
    }

    return (
        <Container p={5} maxW="4xl" mt={3}>
            <Flex mb={2} justifyContent="space-between" alignItems="center">
                <Heading size={'2xl'} mb={5} flex={1}>
                    <HStack gap={3} alignItems="center">
                        <img src="/favicon.svg" alt="Mantis logo" style={{ width: '2rem', height: '2rem' }} />
                        Fast Mantis
                    </HStack>
                </Heading>
                <ColorModeButton />

            </Flex>
            <Flex justify={'end'}>
                <Button variant={'ghost'} onClick={handleReset}>
                    <Trash2 />Limpiar datos
                </Button>
            </Flex>

            <Stack gap={4}>
                <HStack gap={4}>
                    <Field.Root>
                        <Field.Label>Mantis</Field.Label>
                        <Input
                            placeholder='30000'
                            type='number'
                            value={state.mantis}
                            onChange={(e) => setField('mantis', e.target.value.slice(0, 5))}
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Jira</Field.Label>
                        <Input
                            placeholder='TL-0000'
                            value={state.jira}
                            onChange={(e) => setField('jira', e.target.value)}
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Tipo</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                placeholder="Seleccionar tipo de mantis"
                                value={state.tipoMantis}
                                onChange={(e) => setField('tipoMantis', e.target.value)}
                            >
                                {TIPOS_MANTIS.map((tipo) => (
                                    <option key={tipo.title} value={tipo.title}>{tipo.title}</option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>
                </HStack>

                <Field.Root>
                    <Field.Label>Mantis Title</Field.Label>
                    <Input value={state.title} onChange={(e) => setField('title', e.target.value)} />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Jira Title</Field.Label>
                    <Input value={state.jiraTitle} onChange={(e) => setField('jiraTitle', e.target.value)} />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Descripción corta</Field.Label>
                    <Input value={state.brief} onChange={(e) => setField('brief', e.target.value)} />
                </Field.Root>

                <Box borderWidth="1px" borderRadius="md" p={4}>
                    <Heading size="md" mb={4}>Componentes</Heading>
                    {state.components.map((comp, index) => (
                        <HStack key={index} mb={3} gap={3} alignItems="flex-end">
                            <Field.Root flex={2}>
                                <Field.Label>Nombre del componente</Field.Label>
                                <Input
                                    value={comp.componente}
                                    onChange={(e) => updateComponent(index, 'componente', e.target.value)}
                                />
                            </Field.Root>
                            <Field.Root flex={1}>
                                <Field.Label>Versión DLL</Field.Label>
                                <InputGroup startElement="10.1.">
                                    <Input
                                        placeholder='41.1'
                                        value={comp.version_dll}
                                        onChange={(e) => updateComponent(index, 'version_dll', e.target.value)}
                                    />
                                </InputGroup>
                            </Field.Root>
                            <Field.Root flex={1}>
                                <Field.Label>Versión ASCX</Field.Label>
                                <InputGroup startElement="10.1.">
                                    <Input
                                        placeholder='41.1'
                                        value={comp.version_ascx}
                                        onChange={(e) => updateComponent(index, 'version_ascx', e.target.value)}
                                    />
                                </InputGroup>
                            </Field.Root>
                            <Button
                                variant="ghost"
                                colorPalette="red"
                                size="sm"
                                mb={1}
                                disabled={state.components.length === 1}
                                onClick={() => removeComponent(index)}
                                aria-label="Eliminar componente"
                            >
                                <X />
                            </Button>
                        </HStack>
                    ))}
                </Box>
                <Flex justifyContent="flex-end">
                    <Button onClick={addComponent} variant={'outline'}>Agregar componente</Button>
                </Flex>

                <Switch.Root checked={state.sprint.enabled} onCheckedChange={() => toggleSection('sprint')}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Sprint</Switch.Label>
                </Switch.Root>

                {state.sprint.enabled && (
                    <Field.Root>
                        <Field.Label>Sprint</Field.Label>
                        <Input type='number' max={99} min={0} value={state.sprint.value} onChange={(e) => setSectionValue('sprint', Number(e.target.value))} />
                    </Field.Root>
                )}

                <ChangesSection changes={state.changes} setChanges={(v) => setField('changes', v)} />

                <Switch.Root checked={state.porque.enabled} onCheckedChange={() => toggleSection('porque')}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Por qué</Switch.Label>
                </Switch.Root>

                {state.porque.enabled && (
                    <Field.Root>
                        <Field.Label>Por qué</Field.Label>
                        <Textarea autoresize value={state.porque.value} onChange={(e) => setSectionValue('porque', e.target.value)} />
                    </Field.Root>
                )}

                <Switch.Root checked={state.como.enabled} onCheckedChange={() => toggleSection('como')}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Cómo</Switch.Label>
                </Switch.Root>

                {state.como.enabled && (
                    <Field.Root>
                        <Field.Label>Cómo</Field.Label>
                        <Textarea autoresize value={state.como.value} onChange={(e) => setSectionValue('como', e.target.value)} />
                    </Field.Root>
                )}

                <Switch.Root checked={state.impacto.enabled} onCheckedChange={() => toggleSection('impacto')}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Impacto</Switch.Label>
                </Switch.Root>

                {state.impacto.enabled && (
                    <Field.Root>
                        <Field.Label>Impacto</Field.Label>
                        <Textarea autoresize value={state.impacto.value} onChange={(e) => setSectionValue('impacto', e.target.value)} />
                    </Field.Root>
                )}


                <Switch.Root checked={state.templates.enabled} onCheckedChange={() => toggleSection('templates')}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Templates</Switch.Label>
                </Switch.Root>

                {state.templates.enabled && (
                    <Field.Root>
                        <Field.Label>Templates</Field.Label>
                        <Textarea autoresize value={state.templates.value} onChange={(e) => setSectionValue('templates', e.target.value)} />
                    </Field.Root>
                )}

                <Switch.Root checked={state.formatos.enabled} onCheckedChange={() => toggleSection('formatos')}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Formatos de impresión</Switch.Label>
                </Switch.Root>

                {state.formatos.enabled && (
                    <Field.Root>
                        <Field.Label>Formatos de impresión</Field.Label>
                        <Textarea autoresize value={state.formatos.value} onChange={(e) => setSectionValue('formatos', e.target.value)} />
                    </Field.Root>
                )}

                <Switch.Root checked={state.ticket.enabled} onCheckedChange={() => toggleSection('ticket')}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Ticket relacionado</Switch.Label>
                </Switch.Root>

                {state.ticket.enabled && (
                    <Field.Root>
                        <Field.Label>Ticket relacionado</Field.Label>
                        <Input value={state.ticket.value} onChange={(e) => setSectionValue('ticket', e.target.value)} />
                    </Field.Root>
                )}

                <Switch.Root checked={state.evidencias.enabled} onCheckedChange={() => toggleSection('evidencias')}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Evidencias</Switch.Label>
                </Switch.Root>

                {state.evidencias.enabled && (
                    <Field.Root>
                        <Field.Label>Evidencias</Field.Label>
                        <Input value={state.evidencias.value} onChange={(e) => setSectionValue('evidencias', e.target.value)} />
                    </Field.Root>
                )}

                <Flex justifyContent="flex-end" gap={3} mt={5}>
                    <Flex justifyContent="flex-end" gap={3} flexWrap="wrap">
                        <Button variant={'subtle'} onClick={handleGenerateMarkdown}><Terminal />Markdown</Button>
                        <Button variant={'subtle'} onClick={handleGenerateCommit}><ReceiptText />Commit</Button>
                        <Button variant={'subtle'} onClick={handleGenerateCommitGit}><GitCommitVertical />Commit Git</Button>
                        <Button onClick={handleGeneratePM}><TextAlignJustify />PM</Button>
                        <Button onClick={handleGeneratePDF}><FileText />PDF</Button>
                    </Flex>
                    <Button variant={isSaved ? 'plain' : 'ghost'} onClick={handleSave}>
                        {isSaved ? <LuCheck /> : <Save />}
                    </Button>
                    
                </Flex>

                {state.gitCommitTitle.enabled && (
                    <HStack mt={5} alignItems="end" gap={3}>
                        <Field.Root>
                            <Field.Label>Git Commit Title</Field.Label>
                            <Input value={state.gitCommitTitle.value}
                                onChange={(e) => setSectionValue('gitCommitTitle', e.target.value)}
                                variant={'subtle'}
                            />
                        </Field.Root>
                        <Button variant={isCopyGitTitle ? 'plain' : 'ghost'} onClick={copyGitCommit}>
                            {isCopyGitTitle ? <LuCheck /> : <LuCopy />}
                        </Button>
                    </HStack>
                )}
                <HStack mt={5} alignItems="start" gap={3}>
                    <Textarea placeholder='Output' variant={'subtle'} value={state.output} onChange={(e) => setField('output', e.target.value)} autoresize />
                    <Button variant={isCopy ? 'plain' : 'ghost'} onClick={copyOutput}>
                        {isCopy ? <LuCheck /> : <LuCopy />}
                    </Button>
                </HStack>
                <Flex justifyContent="flex-end">
                    <Button onClick={() => setField('output', '')} variant={'surface'}><BrushCleaning />Limpiar</Button>
                </Flex>
                <Toaster />

                {pdfData && <PDFViewerContainer data={pdfData} />}

            </Stack>
        </Container>
    )
}