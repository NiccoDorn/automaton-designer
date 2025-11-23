# Automaton Designer

<div align="center">
A comprehensive React + Vite application for designing, analyzing, and transforming finite automata with complete automata theory algorithm support.

[**NiccoDorn.github.io/automaton-designer**](https://NiccoDorn.github.io/automaton-designer/)

</div>

## Features

### Core Functionality
- **Interactive Visual Designer** - Canvas-based automaton drawing with drag-and-drop
- **State Management** - Add, delete, and edit states with accepting/start state configuration
- **Transition Management** - Create and edit transitions with multi-symbol support
- **Duplicate Prevention** - Automatic validation to prevent duplicate transition symbols
- **Bulk Operations** - Multi-add states in grid layout, multi-select with Shift+Click
- **Import/Export** - JSON format for saving and loading automata
- **Collapsible Panels** - Properties, Greek Symbols, Analysis Tools, and Construction sections

### Automata Theory Algorithms

#### Transformations
- **Regex → NFA** - Thompson's Construction algorithm (O(n))
  - Live regex validation with detailed error feedback
  - Support for: `*`, `+`, `?`, `|`, `()`, concatenation, `{n}`, `{n,m}` quantifiers
  - Interactive RegexInputModal with syntax help

- **NFA → DFA** - Subset Construction / Powerset Construction (O(2^n))
  - ε-closure computation
  - Step-by-step state construction visualization
  - Automatic state labeling with NFA state sets

- **DFA Minimization** - Hopcroft's Algorithm (O(n log n))
  - Partition refinement with equivalence classes
  - State merging for minimal DFA
  - Step-by-step partition visualization

- **Automaton → Regex** - State Elimination Method (O(4^n))
  - Systematic state elimination
  - Regex simplification
  - Copy-to-clipboard functionality

- **DFA Complement** - State inversion (O(n))

#### Analysis Tools
- **Type Detection** - Automatic DFA/NFA classification with color-coded badge
  - Green badge for DFA (Deterministic Finite Automaton)
  - Blue badge for NFA (Non-deterministic Finite Automaton)
  - Orange badge for invalid automata
- **Language Emptiness** - BFS reachability check
- **Unreachable States** - Forward reachability analysis
- **Dead States** - Backward reachability with red dot indicators
- **DFA Completeness** - Transition table validation
- **Compute Regex** - Generate regular expression from automaton

### Visualization & Simulation
- **Real-time Simulation** - Visual feedback with state/transition highlighting
- **Step-through Mode** - Manual simulation control with 's' key
- **Transformation Steps Modal** - Interactive algorithm visualization
  - Previous/Next navigation through algorithm steps
  - Progress bar with percentage indicator
  - Step-by-step details for DFA Minimization, NFA→DFA, Automaton→Regex
  - "Apply Result" button to accept final transformation
- **Active State Highlighting** - Green glow during simulation
- **Dead State Indicators** - Red dots on non-accepting terminal states
- **Input Validation** - Acceptance/rejection feedback with visual overlay

### Export Options
- **JSON Export** - Save complete automaton structure
- **PNG Export** - High-quality raster image
- **SVG Export** - Scalable vector graphics with proper node/edge rendering
- **LaTeX Export** - TikZ code generation for academic papers
  - Automatic coordinate scaling
  - Copy-to-clipboard with visual feedback
  - Required package documentation included
- **Screenshot Mode** - Toggle with 't', drag to select region, export as PNG

### User Experience
- **Keyboard Shortcuts Modal** - Press 'h' for complete shortcut reference
  - Grouped by category (Navigation, Editing, Tools, History, Dialogs)
  - Multi-column grid layout
  - Click outside or press 'h' again to close
- **Canvas Zoom** - Ctrl+/- or Ctrl+Wheel to zoom, Ctrl+0 to reset (0.5x - 3.0x)
- **Canvas Pan** - Arrow keys for navigation (disabled in input fields)
- **Multi-select** - Shift+Click to select multiple states
- **Theme Support** - Light/Dark/Tech themes with persistent state
- **Responsive Design** - Tailwind CSS 4 with adaptive panels
- **Tab Navigation** - Navigate through states starting from start state
- **Undo/Redo** - Bounded history with 100 steps
- **Auto-expand Panels** - Properties panel expands when selecting nodes
- **Greek Symbols** - Quick insert panel for mathematical symbols (α, β, γ, δ, ε, λ, σ, ω)

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **h** | Show/hide keyboard shortcuts modal |
| **t** | Toggle screenshot mode |
| **s** | Step once in step-through simulation mode |
| **a** | Switch to Add Node mode |
| **e** | Switch to Add Edge mode |
| **v** | Switch to Select mode |
| **m** | Switch to Move mode |
| **i** | Multi-select connected neighbors |
| **c** | Clear canvas |
| **n** | Open multi-add dialog |
| **Delete** | Delete selected nodes/edges |
| **Ctrl/Cmd + Z** | Undo |
| **Ctrl/Cmd + Y** | Redo |
| **Ctrl/Cmd + +** | Zoom in |
| **Ctrl/Cmd + -** | Zoom out |
| **Ctrl/Cmd + 0** | Reset zoom |
| **Ctrl/Cmd + Wheel** | Zoom in/out |
| **Arrow Keys** | Pan canvas (when not in input field) |
| **Tab** | Navigate to next state (from start state) |
| **Shift + Click** | Multi-select states |

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

### Project Structure

```
automaton-designer/
├── automaton_data/          # Example automaton JSON files
│   ├── automaton1.json
│   ├── automaton2.json
│   ├── automaton3.json
│   └── automaton4.json
├── dist/                    # Production build output
├── public/                  # Static assets
├── src/
│   ├── assets/
│   ├── components/          # React components
│   │   ├── AnalysisSection.jsx
│   │   ├── CollapsibleSection.jsx
│   │   ├── ConstructionSection.jsx
│   │   ├── EdgeLabelDialog.jsx
│   │   ├── EdgeList.jsx
│   │   ├── ExportDropdown.jsx
│   │   ├── GraphCanvas.jsx
│   │   ├── GreekSymbolsSection.jsx
│   │   ├── KeyboardShortcutsModal.jsx
│   │   ├── LaTeXExportModal.jsx
│   │   ├── MultiAddDialog.jsx
│   │   ├── NodeEditor.jsx
│   │   ├── PropertiesPanel.jsx
│   │   ├── PropertiesSection.jsx
│   │   ├── RegexInputModal.jsx
│   │   ├── SimulationPanel.jsx
│   │   ├── SimulationResultOverlay.jsx
│   │   ├── Toolbar.jsx
│   │   ├── TransformationStepsModal.jsx
│   │   └── UsageInstructions.jsx
│   ├── constants/
│   │   └── index.js         # Initial automaton states and themes
│   ├── hooks/               # Custom React hooks
│   │   ├── useAutomatonOperations.js
│   │   ├── useAutomatonState.js
│   │   ├── useCanvasInteractions.js
│   │   ├── useCanvasPan.js
│   │   ├── useCanvasResize.js
│   │   ├── useCanvasZoom.js
│   │   ├── useDialogs.js
│   │   ├── useGraphDrawing.js
│   │   ├── useHistory.js
│   │   ├── useKeyboardShortcuts.js
│   │   ├── useSimulation.js
│   │   └── useTheme.js
│   ├── utils/               # Utility functions and algorithms
│   │   ├── automatonAlgorithms.js    # Analysis algorithms
│   │   ├── automatonToRegex.js       # State Elimination Method
│   │   ├── canvasUtils.js            # Canvas coordinate utilities
│   │   ├── dfaMinimization.js        # Hopcroft's Algorithm
│   │   ├── drawingUtils.js           # Canvas drawing functions
│   │   ├── graphOperations.js        # Import/Export operations
│   │   ├── latexExport.js            # TikZ code generation
│   │   ├── nfaToDfa.js               # Subset Construction
│   │   ├── regexParser.js            # Regex validation and parsing
│   │   ├── screenshotUtils.js        # Screenshot capture
│   │   ├── simulationUtils.js        # Simulation logic
│   │   ├── thompsonsConstruction.js  # Thompson's Construction
│   │   └── validation.js             # Input validation
│   ├── App.css
│   ├── App.jsx              # Main application component
│   ├── index.css
│   └── main.jsx
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

### Basic Operations

1. **Select Mode** - Click states to select and edit properties
2. **Add Node Mode** - Click anywhere on canvas to create new states
3. **Add Edge Mode** - Click source state, then destination to create transitions
4. **Move Mode** - Drag states to reposition them
5. **Export** - Choose from JSON, PNG, SVG, or LaTeX formats
6. **Import** - Load a previously saved automaton from JSON

### Transformations

1. **Open Construction Section** - Find in Properties Panel
2. **Choose Operation:**
   - **Complement DFA** - Invert accepting states (instant)
   - **Minimize DFA** - Reduce states using Hopcroft's Algorithm (shows steps)
   - **NFA → DFA** - Convert to deterministic automaton (shows steps)
   - **Regex → Automaton** - Generate NFA from regular expression
3. **View Steps** - Navigate through algorithm execution with Previous/Next
4. **Apply Result** - Accept transformation on final step

### Analysis

1. **Open Analysis Tools Section** - Find in Properties Panel
2. **Run Analysis:**
   - Check Automaton Type (DFA/NFA)
   - Check Language Emptiness
   - Detect Unreachable States
   - Detect Dead States
   - Check DFA Completeness
   - Compute Regex (State Elimination)
3. **View Results** - Detailed feedback with state lists
4. **Copy Regex** - Click copy button to clipboard

## Algorithms Implemented

### Transformation Algorithms

| Algorithm | Purpose | Time Complexity | Step Visualization |
|-----------|---------|----------------|-------------------|
| Thompson's Construction | Regex → NFA | O(n) | No |
| Subset Construction | NFA → DFA | O(2^n) | Yes |
| Hopcroft's Algorithm | DFA Minimization | O(n log n) | Yes |
| State Elimination | Automaton → Regex | O(4^n) | Yes |

### Analysis Algorithms

- **Determinism Check** - Validates DFA properties
- **Language Emptiness** - BFS from start to accepting states
- **Reachability Analysis** - Forward/backward BFS
- **Completeness Check** - Transition table validation
- **Dead State Detection** - Backward reachability from accepting states

## Technologies Used

- **React 19** - UI library with latest features
- **Vite 7** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Canvas API** - High-performance graph rendering
- **ESLint** - Code quality and security checks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you encounter any issues, please open an issue on GitHub:

**Issue Categories:**
- Setup
- Configuration (Vite, ESLint, etc.)
- Functionality bugs
- Algorithm bugs
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
