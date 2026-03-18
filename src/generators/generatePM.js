/**
 * @param {object} data - Result of obtenerDatos()
 * @returns {string}
 */
export function generatePM(data) {
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

    return pm;
}
