# Agent Quick Guide for `mazhul-web-development`

This repository is a portfolio of small web projects. It contains mostly vanilla JavaScript, HTML, and CSS work, plus a Vite app in `vite-app/`.

## What to do first

1. Read the closest `README.md` and any local `AGENTS.md` before changing files.
2. Identify the project type:
   - `vite-app/` → use the Vite scripts.
   - everything else → treat it as a static browser project.
3. Make the smallest correct change. Do not refactor unrelated code.

## Project rules

- Prefer ES6+ classes for non-trivial app/game logic.
- Use explicit state objects or state machines instead of chains of boolean flags.
- Use private class fields when state should stay internal.
- Attach DOM listeners to stable parent containers when elements are created dynamically.
- Persist app/game state with `localStorage` when the project already uses it.
- Keep CSS plain and consistent with the existing styling approach.

## Validation

- Run only the existing checks that are relevant to the files you changed.
- For most folders there is no build step.
- For `vite-app/`, use the project scripts (`npm run dev`, `npm run build`).

## Safety

- Do not create planning or notes files in the repository unless explicitly asked.
- If instructions conflict, follow the closest project document first, then this file, then the root `AGENTS.md`.
