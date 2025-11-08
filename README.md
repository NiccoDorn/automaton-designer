# Automaton Designer

A React + Vite app for designing and simulating automata.

## Prerequisites

- Node.js >= 20
- npm >= 9

## Clone the repository

```bash
git clone https://github.com/NiccoDorn/automaton-designer.git
cd automaton-designer
```
## Setup

- Install dependencies in root directory

```bash
npm install
```

## Run app

- Run the app locally (development mode)

```bash
npm run dev
```

> This will start a local development server, usually at http://localhost:5173 and on save will hot-reload the app to view changes immediately.

## Linting and Syntax Checking with ESLint

- For good practice linting the code before building or committing changes is recommended

```bash
npm run lint
```

- If you want to automatically fix linting issues, you can run:

```bash
npx eslint . --fix
```

## Building the Application

- Build for production

```bash
npm run build
```

## Github Issues

If you encounter any issues while using this template, please open an issue for this repo.
Please be so kind to provide the type of issue you ran into, e.g.: {setup, config (vite), functionality, performance, etc.}

## Additional info about this template and bootstrap

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
