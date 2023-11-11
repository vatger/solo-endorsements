# TypeScript Project Template

A Template for creating Full-Stack Web Applications using the MERN-Stack.

## Project structure

- Backend
  - Controllers
  - Services
- Frontend
- Shared

## Folder structure

| Folder        | comment                                |
| ------------- | -------------------------------------- |
| /             | general project files, tooling configs |
| /.vscode      | Visual Studio Code config files        |
| /dist         | TypeScript output files                |
| /src/         | application source code                |
| /src/backend  | backend source code                    |
| /src/frontend | frontend source code                   |
| /src/shared   | shared source code                     |

## `npm run`

| script        | comment                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `test`        | echoes "no test specifies" and exits with a non-zero exit code                  |
| `paths`       | overwrites import paths in the emitted js files for more stable import behavior |
| `start`       | runs `paths` and runs the backend startup file                                  |
| `dev`         | opens `tsc-watch`, which will watch ts files, compile and restart on change     |
| `spa-dev`     | runs vite for live frontend development                                         |
| `spa-build`   | runs vite to build the react dist files                                         |
| `spa-preview` | runs vite for preview                                                           |
