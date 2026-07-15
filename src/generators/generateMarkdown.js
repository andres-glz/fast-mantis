import { TYPES_COMPONENTS } from "../constants/COMPONENT_TYPES.js";

/**
 * @param {object} data - Result of obtenerDatos()
 * @returns {string}
 */
export function generateMarkdown(data) {
    let mdx = `###`;
    
    if (data.jira) {
        mdx += ` \`${data.jira}\``;
    }
   
    if (data.wp) {
        mdx += ` \`WP-${data.wp}\``;
    }
    
    mdx += ` · ${data.jiraTitle || 'Título del Jira'}`;
    mdx += `\n| Tipo           | Recurso         | Versión      | Ruta           |`;
    mdx += `\n| :------------- | :-------------- | :----------- | :------------- |`;

    data.componentes.forEach(c => {
        if (c.componente.trim() !== "" && c.original.version_dll.trim() !== "") {
            mdx += `\n| ⚙️ **EXE/DLL** | \`${c.componente}.dll\` | \`${c.version_dll}\` | \`bin/release/\` |`;
        }
    });

    data.componentes.forEach(c => {
        if (c.componente.trim() !== "" && c.original.version_ascx.trim() !== "") {
            mdx += `\n| 🖥️ **VIEWS** | \`${c.componente}.ascx\` | \`${c.version_ascx}\` | \`views/\` |`;
        }
    });

    (data.otherComponents || []).forEach((c) => {
        const typeInfo = TYPES_COMPONENTS.find((t) => t.value === c?.type?.value);
        const componentName = (c?.name || "").trim();
        const version = (c?.version || "").trim();

        // Skip the empty default row from state.
        if (!typeInfo || !componentName) return;

        mdx += `\n| ${typeInfo?.emoji || '🧩'} **${typeInfo?.mdx_title || 'OTRO'}** | \`${componentName || "Sin nombre"}\` | \`${version || "N/As"}\` | \`${typeInfo?.path || "N/A"}\` |`;
    });

    return mdx;
}
