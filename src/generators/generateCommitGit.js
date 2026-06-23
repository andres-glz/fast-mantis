import { translateToEnglish } from '../utils/translate';

/**
 * @param {object} data - Result of obtenerDatos()
 * @returns {Promise<string>}
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
export async function generateCommitGit(data) {
    const mantis = data.wp ? `WP-${data.wp}` : '';
    const jira = data.jira || mantis || '';
    const jiraPrefix = jira ? `[${jira}] ` : '';
    const title = data.jiraTitle || data.brief || data.title || '';

    let commit = '';
    if (data.jira) {
        commit += `Ticket: ${data.jira}\n`;
    }
    if (data.wp) {
         commit += `Mantis: WP-${data.wp}\n`;
    }
    
    if (data.reglasNegocio.length > 0) {
        commit += `\nBR:\n${data.reglasNegocio}\n`;
    }
    
    if (data.vistas.length > 0) {
        commit += `\nViews:\n${data.vistas}\n`;
    }
    
    if (data.templates.enabled) {
        commit += `\nTemplates:\n${data.templates.value}\n`;
    }
    
    if (data.formatos.enabled) {
        commit += `\nFormatos de impresión:\n${data.formatos.value}\n`;
    }
    
    const cambiosEnIngles = await translateToEnglish(data.cambios);

    commit += `\nChanges:\n`;
    commit += cambiosEnIngles;

    return commit;
}
