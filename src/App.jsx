import { Box, Button, Container, Flex, Heading, HStack, Stack, Switch, Textarea, VStack } from '@chakra-ui/react'
import { Field, Input } from "@chakra-ui/react"
import { NativeSelect } from "@chakra-ui/react"
import React, { useState } from 'react'
import { ColorModeButton } from './components/ui/color-mode'
import { LuCheck, LuCopy } from 'react-icons/lu'
import { Toaster, toaster } from '@/components/ui/toaster'
import { BrushCleaning, GitCommitVertical, NotepadText, ScanText, TextAlignJustify, TextSelect } from 'lucide-react'

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
    const [usaTemplates, setUsaTemplates] = useState(false)
    const [usaFormatos, setUsaFormatos] = useState(false)
    const [usaSprint, setUsaSprint] = useState(true)
    const [tipoMantis, setTipoMantis] = useState("");
    const [sprint, setSprint] = useState(33);
    const [output, setOutput] = useState("");
    const [isCopy, setIsCopy] = useState(false);

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

    const obtenerDatos = () => {
        // Aquí deberías obtener los datos reales de tu aplicación, por ejemplo, desde el estado o desde un formulario
        return {
            tipo: tipoMantis,
            sprint: sprint,
            componente: "ComponenteEjemplo",
            descripcionCorta: "Descripción corta del cambio",
            mantis: 37139,
            mantisUrl: "https://mantis.tca.com/assist/view.php?id=37139",
            version: "1.0.0",
            descripcionDetallada: "Descripción detallada del cambio realizado en el código.",
            que: "Qué se ha cambiado en el código.",
            porque: "Por qué se ha realizado este cambio.",
            como: "Cómo se ha implementado el cambio.",
            impacto: "Impacto esperado del cambio en el sistema.",
            archivos: "src/App.jsx\nsrc/components/ui/provider.jsx",
            relacionados: "MANTIS-12345"
        };
    }

    
    
        function generateCommit() {
            const datos = obtenerDatos();
            
            let commit = `[${datos.tipo}-${datos.sprint}-${datos.componente}] ${datos.descripcionCorta}

[MANTIS-${datos.mantis}] ${datos.mantisUrl}
-----------------------------------------------------------------
Componente: ${datos.componente}
Versión: ${datos.version}
Sprint: ${datos.sprint}
Tipo: ${datos.tipo}
-----------------------------------------------------------------
Descripción: ${datos.descripcionDetallada}
-----------------------------------------------------------------
Detalles del cambio:
Qué: ${datos.que}

Por qué: ${datos.porque}

Cómo: ${datos.como}

Impacto: ${datos.impacto}`;

            if (datos.archivos) {
                commit += `
-----------------------------------------------------------------
Archivos modificados:`;
                datos.archivos.split('\n').forEach(archivo => {
                    if (archivo.trim()) {
                        commit += `\n- ${archivo.trim()}`;
                    }
                });
            }

            commit += `
-----------------------------------------------------------------
Referencias:
- Mantis: MANTIS-${datos.mantis}
- Sprint: #SPRINT-${datos.sprint}`;

            if (datos.relacionados) {
                commit += `\n- Relacionado: ${datos.relacionados}`;
            }

            setOutput(commit);
        }

        function generatePM() {
            const datos = obtenerDatos();
            
            let pm = `**PM**
**Modificación [${datos.componente}] :**
1.- ${datos.descripcionDetallada}

**Regla de negocios:** ~\\Aplicacion\\front\\bin
**${datos.componente}** ( ${datos.version} )`;

            if (datos.incluirSecciones) {
                pm += `

**Vistas:** Ubicación de archivos: ~\\Views\\Vistas\\[Modulo 'HIS','CE','Catalogos','Consultador','General','EHR','DGIS']
* ${datos.vistas || 'No se generaron cambios.'}

**Templates:** Ubicación de archivos: ~\\Sitio\\Templates\\[Modulo 'DropDownList','Grid','ListView','Scheduler','Tooltip' ]
* ${datos.templates || 'La librería no usa templates'}
**Nota: El archivo KendoSchedulerEditorTemplate.tmpl.htm va por default y no se mueve ya que pertenece a plataforma.**

**Scripts:** Ubicación de archivos: ~\\Sitio\\Scripts
* ${datos.scripts || 'No se generaron cambios sobre scripts.'}

**Estilos:** Ubicación de archivos: ~\\Views\\Assets\\Styles\\[Archivo de estilo CSS]
* ${datos.estilos || 'No se generaron cambios en estilos'}

**Formatos de impresión:** ~\\Aplicacion\\Server\\Control\\[Clave de la empresa 'TCA','MMX', etc... ]
* Se deberán de listar los formatos de impresión del programa. O poner 'NO APLICA' en dado caso de que no usen.`;
            }

            pm += `

**Evidencias:**
* ${datos.evidencias || 'No se generaron evidencias.'}

**Referencias:**
- Mantis: MANTIS-${datos.mantis}
- Sprint: #SPRINT-${datos.sprint}`;

            if (datos.relacionados) {
                pm += `\n- Relacionado: ${datos.relacionados}`;
            }

            setOutput(pm);
        }



    return (
        <Container p={5} maxW="4xl">
            <Flex mb={5} justifyContent="space-between" alignItems="center">
                <Heading mb={5}>Generar de Mantis</Heading>
                <ColorModeButton />
            </Flex>
            <Stack gap={4}>
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

                <Field.Root>
                    <Field.Label>URL</Field.Label>
                    <Input placeholder='https://mantis.tca.com/assist/view.php?id=37139' />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Title</Field.Label>
                    <Input />
                </Field.Root>

                <Switch.Root checked={usaSprint} onCheckedChange={(e) => setUsaSprint(e.checked)}>
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Incluir Sprint</Switch.Label>
                </Switch.Root>

                {usaSprint && (

                    <Field.Root>
                        <Field.Label>Sprint</Field.Label>
                        <Input type='number' value={sprint} onChange={(e) => setSprint(Number(e.target.value))} />
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
                        <Textarea autoresize />
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
                        <Textarea autoresize />
                    </Field.Root>
                )}

                <Flex justifyContent="flex-end" gap={3} mt={5}>
                    <Button w={150} variant={'subtle'} onClick={generateCommit}><GitCommitVertical />Commit</Button>
                    <Button w={150} onClick={generatePM}><NotepadText />PM</Button>
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
