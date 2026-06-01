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

    return mdx;
}
