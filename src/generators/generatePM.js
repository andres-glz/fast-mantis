import { TYPES_COMPONENTS } from "../constants/COMPONENT_TYPES.js";

/**
 * @param {object} data - Result of obtenerDatos()
 * @returns {string}
 */
export function generatePM(data) {
    let pm = `**PM**\n\nModificación:\n${data.cambios}`;

    if (data.reglasNegocio.length > 0) {
        pm += `\n\nReglas de negocio:   ~/Aplicacion/front/bin/\n${data.reglasNegocio}`;
    }
    if (data.vistas.length > 0) {
        pm += `\n\nVistas:  ~/Sitio/Views/Vistas/\n${data.vistas}`;
    }

    (TYPES_COMPONENTS || []).forEach((componentType) => {
        const items = (data.otherComponents || []).filter((c) => {
            const componentName = (c?.componente || c?.name || "").trim();
            return c?.type?.value === componentType.value && componentName !== "";
        });

        if (items.length === 0) return;

        pm += `\n\n${componentType.label}:  ${componentType.path ? `~/${componentType.path}` : ""}`;
        pm += items
            .map((c) => {
                const componentName = (c?.componente || c?.name || "").trim();
                const version = (c?.version || "").trim();
                return `\n- ${componentName}${version ? ` (Versión: ${version})` : ""}`;
            })
            .join("");
    });

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
