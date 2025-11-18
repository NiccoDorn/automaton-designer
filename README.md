# Automaton Designer

<div align="center">
A lightweight React + Vite app for designing and simulating state automata.

[**NiccoDorn.github.io/automaton-designer**](https://NiccoDorn.github.io/automaton-designer/)

</div>

## Features

### Core Functionality
- Interactive visual automaton designer with canvas-based drawing
- (Bulk) add/delete & edit states and transitions
- Import/Export automata as JSON
- Accepting states and start state configuration
- Multiple interaction modes (Select, Add Node/Edge, Move, Pan, Scroll)
- Collapsible panel interface with Properties, Greek Symbols, and Analysis Tools

### Simulation
- Real-time automaton simulation with visual feedback
- Step-through mode for manual simulation control
- Highlight active states and outgoing transitions
- Input validation and acceptance/rejection feedback

### Analysis Tools
- Check language emptiness
- Detect unreachable states
- Detect dead states with visual indicators (red dot)
- Check DFA completeness and determinism

### User Experience
- Responsive design with Tailwind CSS
- Theme support (Light/Dark/Tech) with persistent state
- Keyboard shortcuts for all major functions
- Tab navigation through states (starting from start state)
- Undo/Redo with bounded history (100 steps)
- Auto-expand properties panel when selecting nodes
- Arrow key canvas panning (disabled in input fields)
- Multi-select states and connected neighbors (i key)

## Prerequisites

- Node.js >= 20
- npm >= 9

## Installation

### Clone the repository

```bash
git clone https://github.com/NiccoDorn/automaton-designer.git
cd automaton-designer
```

### Install dependencies

```bash
npm install
```

This will install all required dependencies including:
- React 19
- Vite 7
- Tailwind CSS 4
- Lucide React (icons)
- ESLint with security and React plugins

## Development

### Run the app locally

```bash
npm run dev
```

This will start a local development server, usually at `http://localhost:5173` with hot-reloading enabled.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (includes linting) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code with ESLint |
| `npm run deploy` | Build and deploy to GitHub Pages |
| `npm run release` | Lint, build, commit, push, and deploy |

## Code Quality

### Linting

This project uses ESLint with the following plugins:
- **eslint-plugin-react** - React-specific linting rules
- **eslint-plugin-react-hooks** - Hooks-specific rules
- **eslint-plugin-security** - Security best practices
- **eslint-plugin-jsx-a11y** - Accessibility checks

Run linting before committing:

```bash
npm run lint
```

Auto-fix linting issues:

```bash
npx eslint . --fix
```

### Project Structure (Development Relevant Files)

```
automaton-designer/
├── automaton_data/
│   ├── automaton1.json
│   ├── automaton2.json
│   ├── automaton3.json
│   └── automaton4.json
├── dist/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── EdgeLabelDialog.jsx
│   │   ├── EdgeList.jsx
│   │   ├── GraphCanvas.jsx
│   │   ├── KeyboardHelp.jsx
│   │   ├── MultiAddDialog.jsx
│   │   ├── NodeEditor.jsx
│   │   ├── PropertiesPanel.jsx
│   │   ├── Toolbar.jsx
│   │   └── UsageInstructions.jsx
│   ├── constants/
│   │   └── index.js
│   ├── hooks/
│   │   ├── useAutomatonOperations.js
│   │   ├── useAutomatonState.js
│   │   ├── useCanvasInteractions.js
│   │   ├── useCanvasPan.js
│   │   ├── useCanvasResize.js
│   │   ├── useDialogs.js
│   │   ├── useGraphDrawing.js
│   │   ├── useHistory.js
│   │   ├── useKeyboardShortcuts.js
│   │   └── useTheme.js
│   ├── utils/
│   │   ├── canvasUtils.js
│   │   ├── drawingUtils.js
│   │   ├── graphOperations.js
│   │   └── validation.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
├── TODO.md
├── typescript-migration.md
└── vite.config.js
```

## Building for Production-Like Usage

### Crucial security checks

- First, check for vulnerabilities in your dependencies

```bash
npm audit # Check for vulnerabilities in packages reported by npm
```

- Then, fix vulnerabilities, if any are found

```bash
npm audit fix # Automatically fix vulnerabilities, may not fix all
npm audit fix --force # Force fix (be careful, may break things, i.e. major version updates ~"SemVer breaking changes")
```

- Nice to know: you can also use third-party tools like [Snyk](https://snyk.io/) for more comprehensive security analysis or
install audit-export globally to export audit reports in different formats like html or json

```bash
npm install -g audit-export
npm audit --json | audit-export --path ./audit-report.html
```

- see [here](audit-report.html) for an example report with no vulnerabilities

### Build the application

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview production build

```bash
npm run preview
```

## Deployment

### Deploy to GitHub Pages

```bash
npm run deploy
```

This will:
1. Run ESLint checks
2. Build the production bundle
3. Deploy to GitHub Pages

The app will be available at: `https://NiccoDorn.github.io/automaton-designer/`

### Full release workflow

```bash
npm run release
```

This will:
1. Lint the code
2. Build the app
3. Commit changes
4. Push to main branch
5. Deploy to GitHub Pages

## Usage

1. **Select Mode** - Click states to select and edit properties
2. **Add Node Mode** - Click anywhere on canvas to create new states
3. **Add Edge Mode** - Click source state, then destination to create transitions
4. **Move Mode** - Drag states to reposition them
5. **Export** - Save your automaton as JSON
6. **Import** - Load a previously saved automaton

## Technologies Used

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Canvas API** - For drawing the automaton graph
- **ESLint** - Code linting and quality checks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you encounter any issues, please open an issue on GitHub:

**Issue Categories:**
- Setup
- Configuration (Vite, ESLint, etc.)
- Functionality bugs
- Performance issues
- Feature requests
- Documentation

Please provide:
- Issue category
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information

## License

MIT

## Author

Nicco Dorn - [GitHub](https://github.com/NiccoDorn)

## Additional info about the initial template and bootstrap

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
