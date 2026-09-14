# Fast Mantis

Fast Mantis es una herramienta web para generar documentación técnica de cambios de software en formato rápido y estandarizado.

Está orientada a bugs, features y tareas evolutivas donde se necesita:

- Texto para PM (Post Mortem) con el detalle final del cambio
- Documento PDF de respaldo con la documentación del cambio
- Texto automatizado para commit
- Markdown automático de librerías y componentes modificados

Repositorio oficial:
https://github.com/andres-glz/fast-mantis

## Objetivo

Reducir tiempo operativo al documentar cambios y mantener un formato consistente entre equipos de desarrollo, QA y gestión.

## Funcionalidades principales

- Generación de Commit en español con estructura completa del cambio
- Generación de Commit Git con bloque de Changes en inglés
- Generación de PM (Post Mortem) con reglas de negocio, vistas, referencias y evidencias
- Generación de Markdown técnico con tabla de artefactos modificados y versiones
- Generación de PDF visual con el resumen del cambio
- Guardado de progreso en el navegador (localStorage)
- Copiado rápido al portapapeles para pegar en Jira, Mantis, Git o correo

## Tipos de salida

### 1. Markdown

Genera un bloque en formato tabla con:

- Ticket Jira y WP/Mantis
- Título del cambio
- DLL/EXE afectadas y versión
- Vistas ASCX afectadas y versión
- Otros componentes configurables con ruta sugerida

Ideal para bitácoras técnicas y releases notes internas.

### 2. Commit

Genera un texto largo en español con:

- Encabezado y descripción breve
- Tipo de Mantis
- Componentes y versiones
- Descripción detallada del cambio
- Secciones opcionales: Por qué, Cómo, Impacto
- Archivos modificados por categoría
- Referencias (Sprint, Mantis, Ticket)

Ideal para documentación formal de entregas.

### 3. Commit Git

Genera un bloque compacto para usar en flujos de Git con:

- Ticket y Mantis
- BR y Views
- Otros componentes
- Changes traducido a inglés automáticamente

Nota: la traducción usa una API pública y, si falla, conserva el texto original.

### 4. PM (Post Mortem)

Genera resumen ejecutivo del cambio con:

- Modificación principal
- Reglas de negocio
- Vistas
- Otros artefactos por tipo
- Referencias (Sprint y Ticket)
- Evidencias

Ideal para cierre de tickets y trazabilidad funcional.

### 5. PDF

Genera una vista PDF con la documentación capturada para compartir con áreas no técnicas o anexar en procesos de auditoría.

## Flujo de uso recomendado

1. Completar datos base:
	- Mantis o WP
	- Jira
	- Sprint
	- Tipo
	- Título
	- Descripción corta

2. Registrar componentes:
	- Librerías (DLL y ASCX con versión)
	- Otros componentes (tipo, nombre y versión)

3. Agregar detalle funcional:
	- Cambios realizados
	- Secciones opcionales (Por qué, Cómo, Impacto)
	- Ticket relacionado y evidencias (si aplica)

4. Generar la salida deseada:
	- Botón Markdown
	- Botón Commit
	- Botón Commit Git
	- Botón PM
	- Botón PDF

5. Copiar salida y reutilizar en:
	- Jira
	- Mantis
	- Pull Request
	- Correo o documentación interna

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

1. Clonar el repositorio
2. Instalar dependencias

Comandos:

npm install

## Ejecución local

Modo desarrollo:

npm run dev

Compilación de producción:

npm run build

Previsualización de build:

npm run preview

Lint:

npm run lint

## Stack técnico

- React 19
- Vite 7
- Chakra UI 3
- React PDF Renderer
- Lucide React

## Persistencia de datos

La aplicación guarda el progreso en localStorage del navegador para que puedas continuar el trabajo más tarde.

Clave utilizada:

fastMantisData

## Estructura del proyecto

- src/generators: constructores de texto para Commit, Commit Git, PM y Markdown
- src/pdf: plantillas y visor PDF
- src/hooks: lógica de estado y normalización de datos
- src/sections: bloques de formulario por dominio
- src/constants: catálogos y tipos
- src/components: componentes UI reutilizables

## Casos de uso típicos

- Documentar una corrección crítica de producción
- Preparar un resumen técnico para QA o PMO
- Estandarizar mensajes de entrega entre desarrolladores
- Generar evidencia documental para auditoría

## Buenas prácticas recomendadas

- Mantener versiones de DLL y ASCX actualizadas antes de generar salida
- Escribir cambios en bullets claros y accionables
- Usar Commit Git cuando el destinatario principal sea repositorio y PR
- Usar PM y PDF para comunicación con stakeholders funcionales

## Licencia

Proyecto de uso interno/equipo. Ajusta esta sección según la política de tu organización si planeas distribución pública.
