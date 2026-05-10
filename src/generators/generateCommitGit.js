/**
 * @param {object} data - Result of obtenerDatos()
 * @param {{ usaPorque: boolean, usaComo: boolean, usaImpacto: boolean }} flags
 * @returns {string}
 * 
 *
Ticket: TL-8541
Mantis: WP-38322

BR:
- MP_TableroMedico.dll (10.1.4.684)

Views:
- MP_TableroMedico_NotaMedica.ascx (10.1.4.61)

Changes:
- Add "Receta Repetitiva" option to the Verification Checklist at ending medical appointment
 */
export function generateCommitGit(data) {
    let commit = `Ticket: ${data.jira || 'TL-0000'}`;
    commit += `\nMantis: WP-${data.mantis || '30000'}`;
    
    if (data.reglasNegocio.length > 0) {
        commit += `\n\nBR:\n${data.reglasNegocio}`;
    }
    
    if (data.vistas.length > 0) {
        commit += `\n\nViews:\n${data.vistas}`;
    }
    
    if (data.templates.enabled) {
        commit += `\n\nTemplates:\n${data.templates.value}`;
    }
    
    if (data.formatos.enabled) {
        commit += `\n\nFormatos de impresión:\n${data.formatos.value}`;
    }
    
    commit += `\n\nChanges:`;
    commit += `\n${data.cambios}`;

    return commit;
}
