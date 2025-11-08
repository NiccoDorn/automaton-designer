# TODOs for this app

| Task                                              | Priority | Effort |
| ------------------------------------------------- | -------- | ------ |
| Optimize layout for smaller screens (iPads only)  | P2       | M      |
| Ensure scalable canvas and adaptive side panels   | P1       | M      |
| Add keyboard event listeners for accessibility    | P2       | S      |
| Implement keyboard shortcuts (add/delete/run)     | P2       | M      |
| Implement light/dark mode toggle (persist theme)  | P2       | S      |
| Display clear error messages for invalid automata | P1       | S      |
| Use toast notifications/modals for feedback       | P2       | S      |

## Core Features

| Task                                               | Priority | Effort |
| -------------------------------------------------- | -------- | ------ |
| **NFA → DFA conversion**                           | P1       | M      |
| **DFA minimization (Hopcroft’s algorithm)**        | P1       | M      |
| Table-Filling algorithm                            | P3       | M      |
| Brzozowski’s algorithm (reversal-based)            | P3       | L      |
| **Regular Expression → NFA conversion**            | P1       | M      |
| Regular Expression → DFA conversion                | P3       | M      |
| DFA → Regular Expression conversion                | P3       | L      |
| NFA → Regular Expression conversion                | P3       | L      |
| Detect unreachable/dead states                     | P2       | S      |
| Check completeness of transitions (DFA validation) | P2       | S      |
| Save/load automata (local storage, JSON)           | P1       | M      |
| Export/import automata (file, JSON format)         | P2       | S      |
| Export visualizations (SVG/PNG)                    | P3       | M      |

## QoL Improvements

| Task                                      | Priority | Effort |
| ----------------------------------------- | -------- | ------ |
| Undo/Redo functionality (bounded history) | P1       | M      |
| Zoom in/out & pan (mouse + touchpad)      | P1       | M      |
| Grid snapping for precise state placement | P3       | S      |
| Multi-select states and transitions       | P2       | M      |
| Copy/paste/delete multiple elements       | P2       | M      |
| Context menu for quick actions            | P3       | S      |
| Tooltips and short hints for UI buttons   | P2       | S      |

## Visualization & Simulation

| Task                                                                                 | Priority | Effort |
| ------------------------------------------------------------------------------------ | -------- | ------ |
| Interactive automata graph (react-flow/d3-lite)                                      | P1       | M      |
| Visualize automata operations (union, intersection, complement, concatenation, star) | P2       | L      |
| Step-by-step algorithm visualization (Hopcroft, NFA→DFA)                             | P2       | L      |
| Step-by-step input simulation                                                        | P1       | M      |
| Highlight active states/transitions during simulation                                | P1       | S      |
| Optimize rendering for large automata (memoization, lazy updates)                    | P2       | M      |

## Testing & Documentation

| Task                                                 | Priority | Effort |
| ---------------------------------------------------- | -------- | ------ |
| Unit tests for automata algorithms (Jest + RTL)      | P1       | M      |
| Snapshot tests for visualization components          | P2       | S      |
| Edge case tests (empty automata, unreachable states) | P2       | S      |
| Inline JSDoc/TSDoc for algorithms/components         | P2       | S      |
| In-app help/tooltips explaining algorithms           | P3       | S      |
| Markdown “About” / “Help” section for GitHub Pages   | P3       | S      |

## Tech / Build

| Task                                       | Priority | Effort |
| ------------------------------------------ | -------- | ------ |
| Lightweight setup (React + Vite + Zustand) | P1       | M      |
| Tree-shaking, code splitting               | P1       | S      |
| Lazy-load algorithm modules                | P2       | S      |
| GitHub Pages CI/CD setup                   | P1       | S      |


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
