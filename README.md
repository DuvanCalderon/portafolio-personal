# Portafolio personal — Duván Calderón

<p align="center">
  <img src="assets/img/perfil.webp" alt="Retrato profesional de Duván Calderón" width="200" />
</p>

<p align="center">
  <strong>Ingeniería de Sistemas e Informática · Desarrollo web</strong><br />
  Universidad Nacional de Colombia · Medellín
</p>

<p align="center">
  <a href="https://duvancalderon.github.io/portafolio-personal/">Ver portafolio web</a>
</p>

Primera versión de mi sitio personal de desarrollo web, construido con **HTML, CSS y JavaScript**.

## Contenido

Presentación, sobre mí, habilidades, proyectos destacados, formación, idiomas y contacto.

## Proyectos destacados

### Capi Bolis — catálogo y pedidos (MVP)

Aplicación web para un emprendimiento de bolis gourmet caseros. Incluye catálogo filtrable de siete sabores, carrito interactivo, descuentos automáticos por volumen y validación de datos para preparar pedidos por WhatsApp. Diseño responsive y pruebas automatizadas de carrito y pedidos. El prototipo no procesa pagos ni confirma pedidos automáticamente.

**Tecnologías:** HTML, CSS, JavaScript (ES Modules), Node.js para pruebas y GitHub Actions.

[Ver demo](https://duvancalderon.github.io/Capi-bolis/) · [Código fuente](https://github.com/DuvanCalderon/Capi-bolis)

## Estructura

```text
index.html
assets/
  css/styles.css
  js/main.js
  js/effects.js
  img/favicon.svg
  img/perfil.webp
  img/capi-bolis.webp
docs/WORKFLOW.md
.gitignore
README.md
```

## Desarrollo local

Abre `index.html` en el navegador o utiliza Live Server desde VS Code. No requiere npm, compilación ni dependencias externas.

Los textos, enlaces y proyectos se pueden actualizar en **`index.html`**. Los estilos se encuentran en `assets/css/styles.css`.

`assets/js/main.js` gestiona el menú. `assets/js/effects.js` añade las partículas, la inclinación del editor y las apariciones al hacer scroll. El contenido y los enlaces están disponibles desde el HTML.

## Publicación con GitHub Pages

Repositorio: https://github.com/DuvanCalderon/portafolio-personal

En GitHub abre **Settings → Pages → Build and deployment → Deploy from a branch**, selecciona **main** y **/(root)**, y guarda.

Una vez activado y desplegado, el sitio debería abrir en:
https://duvancalderon.github.io/portafolio-personal/

## Fuente editorial

[Mi portafolio personal — Notion](https://app.notion.com/p/41d60fb53673807daa20dc2a61304335)

El contenido no se sincroniza automáticamente: revisa y aprueba los cambios en Notion y trasládalos a `index.html`.

## Próximas mejoras

- Incorporar más proyectos destacados y documentar la contribución personal.
- Integrar el CV cuando esté listo para publicación.
- Revisar accesibilidad, rendimiento y diseño responsive con Codex y `modern-web-guidance`.
- Evaluar versión en inglés.

> Portafolio en evolución, con proyectos documentados y enlaces a su código fuente.
