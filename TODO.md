# TODOs for this app

| Task                                              | Priority | Effort | Done |
| ------------------------------------------------- | -------- | ------ | ---- |
| Optimize layout for smaller screens (iPads only)  | P2       | M      | No   |
| Ensure scalable canvas and adaptive side panels   | P1       | M      | Yes  |
| Add keyboard event listeners for accessibility    | P2       | S      | Yes  |
| Implement keyboard shortcuts (add/delete/run)     | P2       | M      | Yes  |
| Implement light/dark mode toggle (persist theme)  | P2       | S      | Yes  |
| Display clear error messages for invalid automata | P1       | S      | Yes  |
| Use toast notifications/modals for feedback       | P2       | S      | Yes  |

## Core Features & Algorithms

| Task                                               | Priority | Effort | Done | Notes                                          |
| -------------------------------------------------- | -------- | ------ | ---- | ---------------------------------------------- |
| NFA → DFA conversion                               | P1       | M      | Yes  | Subset Construction with step visualization    |
| DFA minimization (Hopcroft's algorithm)            | P1       | M      | Yes  | With partition refinement steps                |
| Table-Filling algorithm                            | P3       | M      | No   |                                                |
| Brzozowski's algorithm (reversal-based)            | P3       | L      | No   |                                                |
| Regular Expression → NFA conversion                | P1       | M      | Yes  | Thompson's Construction with live validation   |
| Regular Expression → DFA conversion                | P3       | M      | No   | Can be done via Regex→NFA→DFA                  |
| DFA → Regular Expression conversion                | P3       | L      | Yes  | State Elimination Method with copy feature     |
| NFA → Regular Expression conversion                | P3       | L      | Yes  | Via State Elimination (works on NFAs too)      |
| Construct Powerset Automata from given NFA         | P2       | M      | Yes  | Part of NFA→DFA Subset Construction            |
| Automata operations: Union, Intersection, Cmplt    | P2       | L      | Part | Complement implemented, Union/Intersection TBD |
| Automata operations: Concatenation, Kleene Star    | P2       | L      | No   | Can be built via regex operations              |
| Check equivalence of two DFAs                      | P2       | M      | No   |                                                |
| Check emptiness of language accepted by automaton  | P2       | S      | Yes  |                                                |
| Check finiteness of language accepted by automaton | P2       | M      | No   |                                                |
| Detect unreachable states                          | P2       | S      | Yes  |                                                |
| Detect dead states                                 | P2       | S      | Yes  | Red dot indicator on dead states               |
| Check completeness of transitions (DFA validation) | P2       | S      | Yes  |                                                |
| Save/load automata (local storage, JSON)           | P1       | M      | Yes  |                                                |
| Export/import automata (file, JSON format)         | P2       | S      | Yes  |                                                |
| Export visualizations (SVG/PNG)                    | P3       | M      | Yes  | PNG via screenshot mode, SVG export available  |
| Export automata definitions (Regex, JSON)          | P2       | S      | Yes  | LaTeX TikZ export also available               |

## QoL Improvements

| Task                                      | Priority | Effort | Done | Notes                                |
| ----------------------------------------- | -------- | ------ | ---- | ------------------------------------ |
| Undo/Redo functionality (bounded history) | P1       | M      | Yes  |                                      |
| Zoom in/out & pan (mouse + touchpad)      | P1       | M      | Yes  | Ctrl+/-, Ctrl+Wheel, Ctrl+0          |
| Grid snapping for precise state placement | P3       | S      | Yes  |                                      |
| Multi-select states and transitions       | P2       | M      | Yes  | Shift+Click and "i" shortcut mode    |
| Context menu for quick actions            | P3       | S      | No   |                                      |
| Tooltips and short hints for UI buttons   | P2       | S      | Yes  |                                      |
| Clear canvas functionality                | P2       | S      | Yes  |                                      |
| Multi-add states in grid layout           | P2       | S      | Yes  |                                      |
| Merge select and move modes               | P2       | S      | Yes  |                                      |
| Smart add mode (node/edge fallback)       | P2       | M      | Yes  |                                      |
| Default edge label configuration          | P2       | S      | Yes  |                                      |
| Keyboard shortcuts help/reference         | P2       | S      | Yes  | Press 'h' for modal with all shortcuts |
| Duplicate edge prevention                 | P2       | S      | Yes  | Validates against duplicate symbols  |

## Visualization & Simulation

| Task                                                                                 | Priority | Effort | Done | Notes                                               |
| ------------------------------------------------------------------------------------ | -------- | ------ | ---- | --------------------------------------------------- |
| Interactive automata graph (react-flow/d3-lite)                                      | P1       | M      | Yes  |                                                     |
| Visualize automata operations (union, intersection, complement, concatenation, star) | P2       | L      | No   |                                                     |
| Step-by-step algorithm visualization (Hopcroft, NFA→DFA)                             | P2       | L      | Yes  | TransformationStepsModal with Previous/Next buttons |
| Step-by-step input simulation                                                        | P1       | M      | Yes  |                                                     |
| Highlight active states/transitions during simulation                                | P1       | S      | Yes  |                                                     |
| Optimize rendering for large automata (memoization, lazy updates)                    | P2       | M      | No   |                                                     |
| Theme support (Light/Dark/Tech)                                                      | P2       | M      | Yes  |                                                     |

## Testing & Documentation

| Task                                                 | Priority | Effort | Done | Notes                                      |
| ---------------------------------------------------- | -------- | ------ | ---- | ------------------------------------------ |
| Unit tests for automata algorithms (Jest + RTL)      | P1       | M      | No   | Right now only basic UI tests by me + file validation |
| Integration tests for core user flows (Cypress)      | P1       | M      | No   |                                            |
| Snapshot tests for visualization components          | P2       | S      | No   |                                            |
| Edge case tests (empty automata, unreachable states) | P2       | S      | No   | Right now only enforced by code logic      |
| Inline JSDoc/TSDoc for algorithms/components         | P2       | S      | No   |                                            |
| In-app help/tooltips explaining algorithms           | P3       | S      | No   |                                            |
| Markdown "About" / "Help" section for GitHub Pages   | P3       | S      | No   |                                            |
| Update README with all new features                  | P1       | S      | Yes  | Comprehensive README update completed      |

## Tech / Build

| Task                                       | Priority | Effort | Done |
| ------------------------------------------ | -------- | ------ | ---- |
| Lightweight setup (React + Vite + Zustand) | P1       | M      | Yes  |
| Tree-shaking, code splitting               | P1       | S      | Yes  |
| Lazy-load algorithm modules                | P2       | S      | No   |
| GitHub Pages CI/CD setup                   | P1       | S      | Yes  |

## Recent Additions (Completed in Latest Release)

### Keyboard & UI Enhancements
- ✅ Keyboard Shortcuts Modal (h key, grouped categories)
- ✅ Screenshot Mode (t toggle, drag-to-capture PNG)
- ✅ Canvas Zoom with Ctrl+/-, Ctrl+Wheel, Ctrl+0
- ✅ Shift+Click multiselect for states
- ✅ Export Dropdown (JSON, PNG, SVG, LaTeX)
- ✅ LaTeX TikZ export with copy-to-clipboard

### Automata Theory Algorithms
- ✅ DFA/NFA Type Detection with color-coded badge
- ✅ DFA Complement (state inversion)
- ✅ DFA Minimization (Hopcroft's Algorithm)
- ✅ NFA → DFA (Subset Construction)
- ✅ Regex → NFA (Thompson's Construction)
- ✅ Automaton → Regex (State Elimination)
- ✅ Regex Parser with live validation
- ✅ Transformation Step-by-Step Modal

### New Components & Utils
- ✅ `ConstructionSection.jsx` - Transformation operations panel
- ✅ `RegexInputModal.jsx` - Regex input with validation
- ✅ `TransformationStepsModal.jsx` - Algorithm visualization
- ✅ `KeyboardShortcutsModal.jsx` - Complete shortcut reference
- ✅ `LaTeXExportModal.jsx` - TikZ code display
- ✅ `ExportDropdown.jsx` - Multi-format export
- ✅ `regexParser.js` - Regex validation & parsing
- ✅ `thompsonsConstruction.js` - Thompson's algorithm
- ✅ `dfaMinimization.js` - Hopcroft's algorithm
- ✅ `nfaToDfa.js` - Subset Construction
- ✅ `automatonToRegex.js` - State Elimination
- ✅ `latexExport.js` - TikZ generation
- ✅ `screenshotUtils.js` - Canvas capture
- ✅ `useCanvasZoom.js` - Zoom management hook

## Reference List

| Priority | Meaning                              | Focus Area                                |
| -------- | ------------------------------------ | ----------------------------------------- |
| **P1**   | Must-have for MVP                    | Core algorithms, visualization, UX basics |
| **P2**   | Should-have for stability and polish | QoL, validation, accessibility            |
| **P3**   | Nice-to-have / post-MVP              | Extended algorithms, advanced UI          |

| Effort | Meaning           |
| ------ | ----------------- |
| **S**  | Small (< 1 day)   |
| **M**  | Medium (1–3 days) |
| **L**  | Large (> 3 days)  |
