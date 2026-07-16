import { translateToEnglish } from "../utils/translate";
import { TYPES_COMPONENTS } from "../constants/COMPONENT_TYPES.js";

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
    let commit = "";
    if (data.jira) {
        commit += `Ticket: ${data.jira}`;
    }
    if (data.wp) {
        if (commit) commit += `\n`;
        commit += `Mantis: WP-${data.wp}`;
    }

    if (data.reglasNegocio.length > 0) {
        if (commit) commit += `\n\n`;
        commit += `BR:\n${data.reglasNegocio}`;
    }

    if (data.vistas.length > 0) {
        if (commit) commit += `\n\n`;
        commit += `Views:\n${data.vistas}`;
    }

    (TYPES_COMPONENTS || []).forEach((componentType) => {
        const items = (data.otherComponents || []).filter((c) => {
            const componentName = (c?.name || "").trim();
            return (
                c?.type?.value === componentType.value && componentName !== ""
            );
        });

        if (items.length === 0) return;

        commit += `\n\n${componentType.label}:`;
        commit += items
            .map((c) => {
                const componentName = (c?.name || "").trim();
                const version = (c?.version || "").trim();
                return `\n- ${componentName}${version ? ` (Versión: ${version})` : ""}`;
            })
            .join("");
    });

    const cambiosEnIngles = await translateToEnglish(data.cambios);

    commit += `\n\nChanges:\n`;
    commit += cambiosEnIngles;

    return commit;
}
