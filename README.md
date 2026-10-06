# AI Marketing Capability Lab

Aplicación web para evaluar capacidades de uso de inteligencia artificial en un contexto empresarial, con énfasis en marketing.

## Dimensiones

- Alfabetización en IA: 20 puntos
- Construcción de prompts: 25 puntos
- Evaluación crítica de respuestas de IA: 20 puntos
- Aplicación empresarial en marketing: 20 puntos
- Riesgo, ética y gobernanza: 15 puntos

La aplicación combina selección múltiple, elaboración de prompts, análisis crítico de una respuesta generada por IA, prompts de seguimiento, decisiones de marketing, escenarios de privacidad/sesgo/claims y un reporte final por competencias.

## GitHub Pages

En el repositorio:

1. Settings → Pages
2. Build and deployment → Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Save

La URL esperada será:

https://jesslopezg.github.io/evaluacion-capacidades-ia-marketing/

## Registro opcional en Google Sheets

El archivo `config.js` contiene:

```js
const APP_CONFIG = {
  RESULTS_WEBHOOK_URL: ""
};
```

Puedes desplegar `apps-script.gs` como Web App de Google Apps Script y pegar ahí su URL.

## Nota sobre validación

Esta versión usa una rúbrica observable para las respuestas abiertas y genera un código de intento. Para evaluaciones de mayor importancia, conviene mover la lógica de calificación a un backend y usar IA con una rúbrica estructurada, evitando exponer API keys en GitHub Pages.
