# AI MODEL WITH DeepSeek

**ai-chat** es un proyecto de chat impulsado por inteligencia artificial, diseñado para ejecutarse en Cloudflare Workers utilizando el framework [Hono](https://github.com/honojs/hono) y la biblioteca [ai](https://www.npmjs.com/package/ai). El proyecto integra un modelo de Hugging Face a través del proveedor [workers-ai-provider](https://www.npmjs.com/package/workers-ai-provider) para generar respuestas automatizadas, haciendo especial énfasis en brindar ejemplos prácticos de código con TailwindCSS.

---

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
  - [Modo de Desarrollo](#modo-de-desarrollo)
  - [Despliegue](#despliegue)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Detalles de la Configuración](#detalles-de-la-configuración)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Contacto](#contacto)
- [Roadmap y Features Pendientes](#roadmap-y-features-pendientes)

---

## Características

- **Cloudflare Workers**: Implementación serverless escalable.
- **Framework Hono**: Ruteo y manejo de peticiones HTTP de forma sencilla y eficiente.
- **Inteligencia Artificial**: Generación de texto basada en modelos de Hugging Face.
- **Ejemplos con TailwindCSS**: Las respuestas generadas incluyen ejemplos de código y clases de TailwindCSS, facilitando el aprendizaje interactivo.
- **Configuración Flexible**: Utiliza Wrangler para el despliegue en Cloudflare y TypeScript para garantizar robustez en el desarrollo.

---

## Tecnologías Utilizadas

| Tecnología                  | Versión/Referencia                      | Descripción                                                       |
| --------------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| Cloudflare Workers          | Configurado vía Wrangler                | Plataforma serverless para desplegar el worker                    |
| Hono                        | ^4.6.20                                | Microframework para crear rutas y APIs en JavaScript/TypeScript    |
| ai                          | ^4.1.16                                | Biblioteca para generación de texto basada en modelos de AI       |
| workers-ai-provider         | ^0.0.10                                | Proveedor para integrar modelos de Hugging Face en Cloudflare Workers |
| TypeScript                  | -                                      | Lenguaje que añade tipado estático a JavaScript                     |
| Wrangler                    | ^3.107.2                               | Herramienta para desarrollar y desplegar Cloudflare Workers         |

---

## Instalación

1. **Pre-requisitos**  
   - Tener instalado [Node.js](https://nodejs.org/) (versión LTS recomendada).
   - [npm](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/) como gestor de dependencias.
   - [Wrangler](https://developers.cloudflare.com/workers/wrangler/) para el desarrollo y despliegue en Cloudflare.

2. **Clonar el repositorio**

   ```bash
   git clone https://tu-repositorio-url/ai-chat.git
   cd ai-chat
   ```

3. **Instalar dependencias**

   ```bash
   npm install
   # o si usas Yarn:
   yarn install
   ```

---

## Configuración

El proyecto requiere la configuración de algunas variables y bindings para funcionar correctamente:

- **wrangler.json**  
  Configura el entorno de Cloudflare Workers y especifica las propiedades principales:

  ```json
  {
    "$schema": "node_modules/wrangler/config-schema.json",
    "name": "ai-chat",
    "main": "src/index.ts",
    "compatibility_date": "2025-01-29",
    "observability": {
      "enabled": true
    },
    "ai": {
      "binding": "Ai"
    },
    "vars": {
      "CLOUDFLARE_ACCOUNT": "idaccount......"
    }
  }
  ```
  
- **Variables de entorno y bindings**  
  En el archivo de declaración `worker-configuration.d.ts` se define la interfaz de los bindings disponibles en el worker:

  ```typescript
  interface CloudflareBindings {
    CLOUDFLARE_ACCOUNT: "idaccount";
    Ai: Ai;
  }
  ```

- **Archivos ignorados**  
  El archivo `.gitignore` evita que se incluyan archivos o carpetas que no deben versionarse (por ejemplo, `dist/`, `node_modules/`, configuraciones específicas de desarrollo, etc.).

---

## Uso

El proyecto expone dos endpoints principales, definidos en `src/index.ts`:

### Rutas

- **GET /**  
  Retorna un mensaje de bienvenida.

  **Ejemplo de respuesta:**

  ```
  Hello Hono!
  ```

- **POST /ai**  
  Recibe una solicitud JSON con el campo `prompt` y retorna un texto generado que incluye, entre otros elementos, ejemplos de código y clases TailwindCSS, bajo el rol de "experto en TailwindCSS".

  **Ejemplo de solicitud:**

  ```json
  {
    "prompt": "¿Cómo puedo centrar un div en TailwindCSS?"
  }
  ```

  **Ejemplo de respuesta:**

  ```
  Para centrar un div usando TailwindCSS, puedes utilizar las clases [flex, justify-center, items-center]. A continuación, un ejemplo de código:

  <div class="flex justify-center items-center h-screen">
    <p>Contenido centrado</p>
  </div>
  ```

### Modo de Desarrollo

Para ejecutar el proyecto en ambiente de desarrollo, utiliza el comando:

```bash
npm run dev
```

Este comando inicia el entorno de Wrangler en modo desarrollo, permitiendo realizar pruebas locales.

### Despliegue

Para desplegar la aplicación en Cloudflare Workers, utiliza el siguiente comando:

```bash
npm run deploy
```

Este comando minifica el código y realiza el despliegue utilizando Wrangler.

---

## Estructura del Proyecto

La estructura básica del proyecto es la siguiente:

```
ai-chat/
├── .gitignore                # Archivos y directorios a ignorar en Git
├── package.json              # Dependencias, scripts y configuración del proyecto
├── tsconfig.json             # Configuración del compilador TypeScript
├── wrangler.json             # Configuración de Cloudflare Workers
├── worker-configuration.d.ts # Definición de bindings para Cloudflare Workers
└── src/
    └── index.ts              # Punto de entrada de la aplicación con rutas definidas
```

---

## Scripts Disponibles

Los siguientes scripts están definidos en el archivo `package.json`:

| Comando        | Descripción                                                       |
| -------------- | ----------------------------------------------------------------- |
| `npm run dev`  | Inicia el entorno de desarrollo con Wrangler en modo dev         |
| `npm run deploy` | Despliega la aplicación en Cloudflare Workers, aplicando minificación |
| `npm run cf-typegen` | Genera definiciones de tipos para los bindings de Cloudflare Workers |

---

## Detalles de la Configuración

### Archivo: wrangler.json

- **name**: Identificador del proyecto en Cloudflare Workers.
- **main**: Especifica el punto de entrada del Worker (`src/index.ts`).
- **compatibility_date**: Fecha de compatibilidad para Cloudflare Workers.
- **observability**: Configuración para el monitoreo y observabilidad.
- **ai**: Binding específico para la funcionalidad de IA.
- **vars**: Variables de entorno, como `CLOUDFLARE_ACCOUNT`.

### Archivo: tsconfig.json

El archivo `tsconfig.json` incluye configuraciones importantes para el uso de TypeScript:

- **target**: ESNext
- **module**: ESNext
- **moduleResolution**: Bundler
- **strict**: Habilita el modo estricto
- **types**: Incluye los tipos para Cloudflare Workers
- **jsx**: Configuración para JSX utilizando `hono/jsx`

---

## Contribuir

¡Las contribuciones son bienvenidas! Si deseas colaborar en el proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu nueva funcionalidad o corrección (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y asegúrate de que todas las pruebas pasen.
4. Envía un Pull Request describiendo en detalle los cambios realizados.


## Roadmap y Features Pendientes

A continuación se muestra una lista de funcionalidades y mejoras previstas para el proyecto. Si deseas contribuir, crea una PR e incluye la marca correspondiente en la lista. ¡Cada aporte es importante!

- [ ] **Integrar BD de Vectores 🚀**: Implementar una base de datos especializada para almacenar embeddings y permitir búsquedas semánticas.
- [ ] **Integrar Modelo Langchain 🤖**: Añadir soporte para un modelo basado en Langchain, que facilite la gestión de flujos de trabajo de IA.
- [ ] **Soporte para Más Modelos de IA 🧠**: Incorporar y ofrecer la posibilidad de utilizar múltiples modelos de inteligencia artificial para enriquecer las respuestas.
- [ ] **Modularización del Código 🛠️**: Refactorizar y estructurar el código en módulos independientes, facilitando el mantenimiento y la escalabilidad.
- [ ] **Agregar Nuevos Servicios 🌐**: Desarrollar e integrar servicios adicionales (p.ej., analíticas, notificaciones, monitorización) que amplién las funcionalidades del proyecto.
- [ ] **Frontend en Next.js 15 💻**: Crear una interfaz de usuario interactiva y optimizada utilizando Next.js 15, aprovechando sus capacidades de SSR y PWA.
- [ ] **Mejorar la Documentación y Ejemplos 📚**: Ampliar la documentación con tutoriales, ejemplos de código y guías detalladas para facilitar la incorporación de nuevos contribuidores.
- [ ] **Implementar Pruebas Unitarias e Integración ✅**: Desarrollar un conjunto robusto de tests que asegure la calidad y fiabilidad del código.
- [ ] **Configurar Integración Continua (CI/CD) 🔄**: Establecer pipelines de CI/CD para automatizar pruebas y despliegues, garantizando actualizaciones estables.
- [ ] **Optimización del Rendimiento ⚡**: Realizar ajustes y mejoras para optimizar el uso de recursos y acelerar la respuesta del sistema.

---


---

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## Contacto

Para dudas, sugerencias o colaboración, por favor contacta a:

- **Autor/Equipo de Desarrollo**: [Deus lo vult](mailto:tu.email@dominio.com)
- **Repositorio**: [https://github.com/LostoVayne/ai-chat](https://github.com/LostoVayne/ai-chat)

---