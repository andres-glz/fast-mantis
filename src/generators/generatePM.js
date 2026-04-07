/**
 * @param {object} data - Result of obtenerDatos()
 * @returns {string}
 */
export function generatePM(data) {
    let pm = `** PM **\n\nModificación:\n${data.cambios}`;

    if (data.reglasNegocio.length > 0) {
        pm += `\n\nReglas de negocio:   ~\\Aplicacion\\front\\bin\\\n${data.reglasNegocio}`;
    }
    if (data.vistas.length > 0) {
        pm += `\n\nVistas:  ~\\Sitio\\Views\\Vistas\\\n${data.vistas}`;
    }
    if (data.templates.enabled) {
        pm += `\n\nTemplates:  ~\\Sitio\\Templates\\[Modulo]\\\n${data.templates.value}`;
    }
    if (data.formatos.enabled) {
        pm += `\n\nFormatos de impresión:  ~\\Aplicacion\\Server\\Control\\[Company]\\Formatos\\\n${data.formatos.value}`;
    }

    if (data.sprint.enabled || data.ticket.enabled) {
        pm += `\n\nReferencias:`;

        if (data.sprint.enabled) {
            pm += `\n- Sprint: ${data.sprint.value}`;
        }

        if (data.ticket.enabled) {
            pm += `\n- Ticket: ${data.ticket.value}`;
        }
    }

    if (data.evidencias.enabled) {
        pm += `\n\nEvidencias:\n- ${data.evidencias.value}`;
    }

    return pm;
}
