import { Box, Button, Container, Flex, Heading, HStack, InputGroup, Stack, Switch, Textarea, VStack } from '@chakra-ui/react'
import { Field, Input } from "@chakra-ui/react"
import { NativeSelect } from "@chakra-ui/react"
import React, { useEffect, useState } from 'react'
import { ColorModeButton } from './components/ui/color-mode'
import { LuCheck, LuCopy } from 'react-icons/lu'
import { Toaster, toaster } from '@/components/ui/toaster'
import { BrushCleaning, GitCommitVertical, NotepadText, Save, ScanText, TextAlignJustify, TextSelect, Trash2 } from 'lucide-react'

const tiposMantis = [
    'Mejora de funcionalidad',
    'Error de programa',
    'Actividad',
    'Control de cambios',
    'Funcionalidad nueva',
    'Implementación',
    'Módulo nuevo',
    'Programa nuevo',
]

export const App = () => {
    const [usaSprint, setUsaSprint] = useState(true)
    const [sprint, setSprint] = useState(33);

    const [usaPorque, setUsaPorque] = useState(false)
    const [porque, setPorque] = useState("");

    const [usaComo, setUsaComo] = useState(false)
    const [como, setComo] = useState("");

    const [usaImpacto, setUsaImpacto] = useState(false)
    const [impacto, setImpacto] = useState("");

    const [usaTemplates, setUsaTemplates] = useState(false)
    const [templates, setTemplates] = useState("");

    const [usaFormatos, setUsaFormatos] = useState(false)
    const [formatos, setFormatos] = useState("");

    const [usaTicket, setUsaTicket] = useState(false)
    const [ticket, setTicket] = useState("");

    const [usaEvidencias, setUsaEvidencias] = useState(false)
    const [evidencias, setEvidencias] = useState("");

    const [tipoMantis, setTipoMantis] = useState("");
    const [mantis, setMantis] = useState("");
    const [title, setTitle] = useState("");
    const [brief, setBrief] = useState("");
    const [cambios, setCambios] = useState("");
    const [components, setComponents] = useState([{
        componente: "",
        version_dll: "",
        version_ascx: "",
    }]);
    const [output, setOutput] = useState("");

    const [isCopy, setIsCopy] = useState(false);
    const [isSaved, setIsSaved] = useState(false);


    useEffect(() => {
        const savedData = localStorage.getItem('fastMantisData');
        if (savedData) {
            const data = JSON.parse(savedData);

            setUsaSprint(data.usaSprint || false);
            setSprint(data.sprint || 33);

            setUsaPorque(data.usaPorque || false);
            setPorque(data.porque || "");

            setUsaComo(data.usaComo || false);
            setComo(data.como || "");

            setUsaImpacto(data.usaImpacto || false);
            setImpacto(data.impacto || "");

            setUsaTemplates(data.usaTemplates || false);
            setTemplates(data.templates || "");

            setUsaFormatos(data.usaFormatos || false);
            setFormatos(data.formatos || "");

            setUsaTicket(data.usaTicket || false);
            setTicket(data.ticket || "");

            setUsaEvidencias(data.usaEvidencias || false);
            setEvidencias(data.evidencias || "");

            setTipoMantis(data.tipoMantis || "");
            setMantis(data.mantis || "");
            setTitle(data.title || "");
            setBrief(data.brief || "");
            setCambios(data.cambios || "");
            setOutput(data.output || "");
            setComponents(data.components.length > 0 ? data.components : [{
                componente: "",
                version_dll: "",
                version_ascx: "",
            }]);
        }
    }, []);

    const handleComponentChange = (e, index) => {
        const newComponent = [...components];
        newComponent[index] = {
            ...newComponent[index],
            [e.target.name]: e.target.value,
        };
        setComponents(newComponent);
    }

    function copyOutput(type) {

        navigator.clipboard.writeText(output).then(() => {
            setIsCopy(true);
            toaster.create({
                description: `${type} copiado al portapapeles`,
                type: "success",
                closable: true,
                duration: 1500
            })
            setTimeout(() => {
                setIsCopy(false);
            }, 1500);
        });
    }

    function saveProgress() {
        localStorage.setItem('fastMantisData', JSON.stringify({
            usaSprint,
            sprint,

            usaPorque,
            porque,

            usaComo,
            como,

            usaImpacto,
            impacto,

            usaTemplates,
            templates,

            usaFormatos,
            formatos,

            usaTicket,
            ticket,

            usaEvidencias,
            evidencias,

            tipoMantis,
            mantis,
            title,
            brief,
            cambios,
            components,
            output,
        }));
        setIsSaved(true);
        toaster.create({
            description: `Progreso guardado`,
            type: "success",
            closable: true,
            duration: 1500
        })
        setTimeout(() => {
            setIsSaved(false);
        }, 1500);
    }

    function resetForm() {
        setUsaSprint(true);
        setSprint(33);

        setUsaPorque(false);
        setPorque("");

        setUsaComo(false);
        setComo("");

        setUsaImpacto(false);
        setImpacto("");

        setUsaTemplates(false);
        setTemplates("");

        setUsaFormatos(false);
        setFormatos("");

        setUsaTicket(false);
        setTicket("");

        setUsaEvidencias(false);
        setEvidencias("");

        setTipoMantis("");
        setMantis("");
        setTitle("");
        setBrief("");
        setCambios("");
        setComponents([{
            componente: "",
            version_dll: "",
            version_ascx: "",
        }]);
        setOutput("");
    }

    const obtenerDatos = () => {
        let tipo = tipoMantis;
        let commitTitle = `${tipoMantis}`;
        let sprintText = usaSprint ? `Sprint: ${sprint}` : "";
        if (tipoMantis.length === 0) {
            tipo = "Tipo de Mantis";
        }

        if (usaSprint) {
            commitTitle = `${tipo} - ${sprintText}`;
        }


        return {
            commitTitle,
            brief: brief || "Descripción corta del cambio",
            title: title || "Título del Mantis",
            mantisUrl: `https://mantis.tca.com/assist/view.php?id=${mantis || '3XXXX'}`,
            tipo,
            sprint: sprint,
            sprintText,
            componentes: components.filter(c => c.componente.trim() !== "").map(c => ({
                componente: c.componente,
                version_dll: '10.1.' + c.version_dll,
                version_ascx: '10.1.' + c.version_ascx,
                version: `DLL: 10.1.${c.version_dll || 'X.X'}${c.version_ascx ? ', ASCX: 10.1.' + c.version_ascx : ''}`
            })),
            templates: templates,
            formatos: formatos,
            reglasNegocio: components.filter(c => c.version_dll.trim() !== "").map(c => `- ${c.componente}.dll (Versión: 10.1.${c.version_dll})`).join('\n'),
            vistas: components.filter(c => c.version_ascx.trim() !== "").map(c => `- ${c.componente}.ascx (Versión: 10.1.${c.version_ascx})`).join('\n'),
            mantis: mantis || '3XXXX',
            cambios: cambios || "- Descripción detallada del cambio realizado en el código.",
            que: "Qué se ha cambiado en el código.",
            porque: porque || "Razón por la cual se ha realizado el cambio.",
            como: como || "Cómo se ha implementado el cambio.",
            impacto: impacto || "Impacto esperado del cambio en el sistema.",
            archivos: "src/App.jsx\nsrc/components/ui/provider.jsx",
            ticket: ticket,
            evidencias: evidencias,
        };
    }


    function generateCommit() {
        const data = obtenerDatos();

        let commit = `[${data.commitTitle}] ${data.brief}

${data.title}
${data.mantisUrl}
-----------------------------------------------------------------
Tipo: ${data.tipo}
Sprint: ${data.sprint}
Componentes:
${data.componentes.map(c => `- ${c.componente} (${c.version})`).join('\n')}
-----------------------------------------------------------------
Descripción:
${data.cambios}
-----------------------------------------------------------------
Detalles del cambio:
Qué: ${data.brief}\n`;

        if (usaPorque) {
            commit += `\nPor qué: ${data.porque}\n`;
        }

        if (usaComo) {
            commit += `\nCómo: ${data.como}\n`;
        }

        if (usaImpacto) {
            commit += `\nImpacto: ${data.impacto}\n`;
        }

        commit += `
-----------------------------------------------------------------
Archivos modificados:`;
        if (data.reglasNegocio.length > 0) {
            commit += `\n\nReglas de negocio:\n${data.reglasNegocio}`;
        }
        if (data.vistas.length > 0) {
            commit += `\n\nVistas:\n${data.vistas}`;
        }
        if (data.templates.length > 0) {
            commit += `\n\nTemplates:\n${data.templates}`;
        }
        if (data.formatos.length > 0) {
            commit += `\n\nFormatos de impresión:\n${data.formatos}`;
        }


        commit += `
-----------------------------------------------------------------
Referencias:`;
        if (data.sprint) {
            commit += `\n- Sprint: ${data.sprint}`;
        }

        commit += `\n- Mantis: ${data.mantis}`;
        commit += `\n- URL: ${data.mantisUrl}`;

        if (data.ticket) {
            commit += `\n- Ticket: ${data.ticket}`;
        }

        setOutput(commit);
    }

    function generatePM() {
        const data = obtenerDatos();

        let pm = `** PM **

Modificación:
${data.cambios}`;

        if (data.reglasNegocio.length > 0) {
            pm += `\n\nReglas de negocio:   ~\\Aplicacion\\front\\bin\\
${data.reglasNegocio}`;
        }
        if (data.vistas.length > 0) {
            pm += `\n\nVistas:  ~\\Sitio\\Views\\Vistas\\
${data.vistas}`;
        }
        if (data.templates.length > 0) {
            pm += `\n\nTemplates:  ~\\Sitio\\Templates\\[Modulo]\\
${data.templates}`;
        }
        if (data.formatos.length > 0) {
            pm += `\n\nFormatos de impresión:  ~\\Aplicacion\\Server\\Control\\[Company]\\Formatos\\
${data.formatos}`;
        }

        pm += `

Referencias:`;
        if (data.sprint) {
            pm += `\n- Sprint: ${data.sprint}`;
        }

        if (data.ticket) {
            pm += `\n- Ticket: ${data.ticket}`;
        }

        if (data.evidencias) {
            pm += `

Evidencias:
- ${data.evidencias}`;
        }

        setOutput(pm);
    }

    function validarMantis(e) {
        if (e.target.value.length > 5) e.target.value = e.target.value.slice(0, 5);

        setMantis(e.target.value)
    }

    return (
        <Container p={5} maxW="4xl" mt={3}>
            <Flex mb={2} justifyContent="space-between" alignItems="center">
                <Heading size={'2xl'} mb={5} flex={1}>Generar de Mantis</Heading>
                <ColorModeButton />

            </Flex>
            <Flex justify={'end'}>
                <Button variant={'ghost'} onClick={resetForm}>
                    <Trash2 />Limpiar datos
                </Button>
            </Flex>
            <Stack gap={4}>
                <HStack gap={4}>
                    <Field.Root>
                        <Field.Label>Mantis</Field.Label>
                        <Input placeholder='30000' type='number' value={mantis} onChange={validarMantis} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Tipo</Field.Label>
                        <NativeSelect.Root  >
                            <NativeSelect.Field placeholder="Seleccionar tipo de mantis" value={tipoMantis} onChange={(e) => setTipoMantis(e.target.value)}>
                                {tiposMantis.map((tipo) => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>


                </HStack>

                <Field.Root>
                    <Field.Label>Title</Field.Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Descripción corta</Field.Label>
                    <Input value={brief} onChange={(e) => setBrief(e.target.value)} />
                </Field.Root>

                <Box borderWidth="1px" borderRadius="md" p={4}>
                    <Heading size="md" mb={4}>Componentes</Heading>
                    {components.map((componente, index) => (
                        <HStack key={index} mb={3} gap={3}>
                            <Field.Root flex={2}>
                                <Field.Label>Nombre del componente</Field.Label>
                                <Input name='componente' value={componente.componente} onChange={(e) => handleComponentChange(e, index)} />
                            </Field.Root>
                            <Field.Root flex={1}>
                                <Field.Label>Versión DLL</Field.Label>
                                <InputGroup
                                    startElement="10.1."
                                >
                                    <Input name='version_dll' placeholder='41.1' value={componente.version_dll} onChange={(e) => handleComponentChange(e, index)} />
                                </InputGroup>
                            </Field.Root>
                            <Field.Root flex={1}>
                                <Field.Label>Versión ASCX</Field.Label>
                                <InputGroup
                                    startElement="10.1."
                                >
                                    <Input name='version_ascx' placeholder='41.1' value={componente.version_ascx} onChange={(e) => handleComponentChange(e, index)} />
                                </InputGroup>
                            </Field.Root>
                        </HStack>
                    ))}
                </Box>
                <Flex justifyContent="flex-end">
                    <Button onClick={() => setComponents([...components, { componente: "", version_dll: "", version_ascx: "" }])} variant={'outline'}>Agregar componente</Button>
                </Flex>

                <Switch.Root checked={usaSprint} onCheckedChange={(e) => setUsaSprint(e.checked)}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Sprint</Switch.Label>
                </Switch.Root>

                {usaSprint && (

                    <Field.Root>
                        <Field.Label>Sprint</Field.Label>
                        <Input type='number' max={99} min={0} value={sprint} onChange={(e) => setSprint(Number(e.target.value))} />
                    </Field.Root>

                )}

                <Field.Root>
                    <Field.Label>Cambios realizados</Field.Label>
                    <Textarea autoresize value={cambios} onChange={(e) => setCambios(e.target.value)} />
                </Field.Root>

                <Switch.Root checked={usaPorque} onCheckedChange={(e) => setUsaPorque(e.checked)}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Por qué</Switch.Label>
                </Switch.Root>

                {usaPorque && (

                    <Field.Root>
                        <Field.Label>Por qué</Field.Label>
                        <Textarea autoresize value={porque} onChange={(e) => setPorque(e.target.value)} />
                    </Field.Root>

                )}

                <Switch.Root checked={usaComo} onCheckedChange={(e) => setUsaComo(e.checked)}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Cómo</Switch.Label>
                </Switch.Root>

                {usaComo && (

                    <Field.Root>
                        <Field.Label>Cómo</Field.Label>
                        <Textarea autoresize value={como} onChange={(e) => setComo(e.target.value)} />
                    </Field.Root>

                )}

                <Switch.Root checked={usaImpacto} onCheckedChange={(e) => setUsaImpacto(e.checked)}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Impacto</Switch.Label>
                </Switch.Root>

                {usaImpacto && (

                    <Field.Root>
                        <Field.Label>Impacto</Field.Label>
                        <Textarea autoresize value={impacto} onChange={(e) => setImpacto(e.target.value)} />
                    </Field.Root>

                )}


                <Switch.Root checked={usaTemplates} onCheckedChange={(e) => setUsaTemplates(e.checked)}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Templates</Switch.Label>
                </Switch.Root>

                {usaTemplates && (

                    <Field.Root>
                        <Field.Label>Templates</Field.Label>
                        <Textarea autoresize value={templates} onChange={(e) => setTemplates(e.target.value)} />
                    </Field.Root>
                )}

                <Switch.Root checked={usaFormatos} onCheckedChange={(e) => setUsaFormatos(e.checked)}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Formatos de impresión</Switch.Label>
                </Switch.Root>

                {usaFormatos && (

                    <Field.Root>
                        <Field.Label>Formatos de impresión</Field.Label>
                        <Textarea autoresize value={formatos} onChange={(e) => setFormatos(e.target.value)} />
                    </Field.Root>
                )}

                <Switch.Root checked={usaTicket} onCheckedChange={(e) => setUsaTicket(e.checked)}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Ticket relacionado</Switch.Label>
                </Switch.Root>

                {usaTicket && (

                    <Field.Root>
                        <Field.Label>Ticket relacionado</Field.Label>
                        <Input value={ticket} onChange={(e) => setTicket(e.target.value)} />
                    </Field.Root>

                )}

                <Switch.Root checked={usaEvidencias} onCheckedChange={(e) => setUsaEvidencias(e.checked)}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Evidencias</Switch.Label>
                </Switch.Root>

                {usaEvidencias && (

                    <Field.Root>
                        <Field.Label>Evidencias</Field.Label>
                        <Input value={evidencias} onChange={(e) => setEvidencias(e.target.value)} />
                    </Field.Root>

                )}

                <Flex justifyContent="flex-end" gap={3} mt={5}>
                    <Button w={150} variant={'subtle'} onClick={generateCommit}><GitCommitVertical />Commit</Button>
                    <Button w={150} onClick={generatePM}><NotepadText />PM</Button>
                    <Button variant={isSaved ? 'plain' : 'ghost'} id='btnCopy' onClick={() => saveProgress()}>
                        {!isSaved ? (
                            <Save />
                        ) : (
                            <LuCheck />
                        )}
                    </Button>
                    <Button variant={isCopy ? 'plain' : 'ghost'} id='btnCopy' onClick={() => copyOutput(
                        output.includes("PM") ? "PM" : "Commit"
                    )}>
                        {!isCopy ? (
                            <LuCopy />
                        ) : (
                            <LuCheck />
                        )}
                    </Button>
                </Flex>

                <Textarea mt={5} placeholder='Output' variant={'subtle'} value={output} onChange={(e) => setOutput(e.target.value)} autoresize />
                <Flex justifyContent="flex-end">
                    <Button onClick={() => setOutput("")} variant={'surface'}><BrushCleaning />Limpiar</Button>
                </Flex>
                <Toaster />

            </Stack>
        </Container>
    )
}
