/**
 * @param {object} data - Result of obtenerDatos()
 * @param {{ usaPorque: boolean, usaComo: boolean, usaImpacto: boolean }} flags
 * @returns {string}
 */
export function generateCommit(data) {
    let commit = `[${data.commitTitle}] ${data.brief}\n`;
    commit += `\n${data.title}`;
    commit += `\n${data.mantisUrl}`;
    commit += `\n-----------------------------------------------------------------`;
    commit += `\nTipo: ${data.tipoMantis}`;

    if (data.sprint.enabled) {
        commit += `\nSprint: ${data.sprint.value}`;
    }

    commit += `\nComponentes:`;
    commit += `\n${data.componentes.map((c) => `- ${c.componente} (${c.version})`).join("\n")}`;
    commit += `\n-----------------------------------------------------------------`;
    commit += `\nDescripción:`;
    commit += `\n${data.cambios}`;

    commit += `\n-----------------------------------------------------------------`;
    commit += `\nDetalles del cambio:`;
    commit += `\n\nQué: ${data.brief}`;

    if (data.porque.enabled) {
        commit += `\n\nPor qué: ${data.porque.value}`;
    }

    if (data.como.enabled) {
        commit += `\n\nCómo: ${data.como.value}`;
    }

    if (data.impacto.enabled) {
        commit += `\n\nImpacto: ${data.impacto.value}`;
    }

    commit += `\n-----------------------------------------------------------------`;
    commit += `\nArchivos modificados:`;

    if (data.reglasNegocio.length > 0) {
        commit += `\n\nReglas de negocio:\n${data.reglasNegocio}`;
    }
    if (data.vistas.length > 0) {
        commit += `\n\nVistas:\n${data.vistas}`;
    }
    if (data.templates.enabled) {
        commit += `\n\nTemplates:\n${data.templates.value}`;
    }
    if (data.formatos.enabled) {
        commit += `\n\nFormatos de impresión:\n${data.formatos.value}`;
    }

    commit += `\n-----------------------------------------------------------------`;
    commit += `\nReferencias:`;

    if (data.sprint.enabled) {
        commit += `\n- Sprint: ${data.sprint.value}`;
    }

    if (data.mantisEnabled) {
        commit += `\n- Mantis: ${data.mantis}`;
        commit += `\n- URL: ${data.mantisUrl}`;
    }

    if (data.ticket.enabled) {
        commit += `\n- Ticket: ${data.ticket.value}`;
    }

    return commit;
}
