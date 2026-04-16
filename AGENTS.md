# AI Agent Guidelines for mazhul-web-development

## Architecture & Big Picture

- This workspace contains multiple pure JavaScript (Vanilla JS), HTML, and CSS web development projects. It is primarily
  used for academic projects and web design practice across different semesters (`javascript-semester-2`,
  `web-design-semester-1`, `web-design-semester-2`).
- A Vite-based project is also present under `vite-app/`.
- The codebase relies strongly on fundamental web development APIs rather than complex component frameworks, meaning
  direct DOM manipulation (e.g. `document.querySelector`) and plain JavaScript logic structure are prevalent.

## Code Conventions & Patterns

- **Object-Oriented JavaScript:** New features/logic in mini-games and applications should be encapsulated using
  JavaScript ES6+ Classes.
- **State Machines:** Use explicit state objects (e.g., `Object.freeze` with specific statuses) inside classes rather
  than boolean flags. See `javascript-semester-2/SimonSays/main.js` for an example of a cleanly implemented finite state
  machine.
- **Encapsulation:** Enforce encapsulation using JavaScript Private Class Features (`#fieldName`).
- **Event Delegation:** Ensure DOM event listeners are attached to primary parent containers (e.g., `#container`) rather
  than individual elements when dynamically creating list items, cards, or buttons. This reduces re-renders and memory
  leaks.
- **Local Storage Integration:** Persist application or specific game instance states (like score, running sequence,
  step) using the `localStorage` API. Implement dedicated `save()` and `load()` methods within classes.

## Workflow & Development

- **No Build Steps for Most Folders:** Projects outside the `vite-app` folder do not require a build step and can be
  served statically. When writing code for these folders, ensure browser-compatible ES6 code without relying on complex
  module bundlers unless inside a sub-project that explicitly uses one.
- **Vite Applications:** Standard `npm run dev` and `npm run build` scripts apply to the `vite-app`.

## CSS & Styling

- Styles are plain CSS (e.g., `style.css`), mostly un-preprocessed. Maintain separation of layout, coloring, and
  animations without enforcing BEM unless explicitly requested in a subproject.

Always defer reading the closest `.md` documentation within a respective sub-project to learn specific requirements
before making modifications.

