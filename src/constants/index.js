export const NODE_RADIUS = 25;
export const ACCEPTING_RADIUS = 30;

export const INITIAL_NODES = [
    { id: 0, x: 100, y: 150, label: 'q0', isAccepting: true, isStart: true },
    { id: 1, x: 300, y: 150, label: 'q1', isAccepting: false, isStart: false },
    { id: 2, x: 500, y: 150, label: 'q2', isAccepting: false, isStart: false }
];

export const INITIAL_EDGES = [
    { from: 0, to: 1, label: 'a', id: 0 },
    { from: 1, to: 2, label: 'b', id: 1 },
    { from: 2, to: 2, label: 'c', id: 2 }
];