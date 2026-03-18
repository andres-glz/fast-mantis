/**
 * @param {object} data - Result of obtenerDatos()
 * @param {{ usaPorque: boolean, usaComo: boolean, usaImpacto: boolean }} flags
 * @returns {string}
 */
export function generateCommit(data, { usaPorque, usaComo, usaImpacto }) {
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

    return commit;
}
