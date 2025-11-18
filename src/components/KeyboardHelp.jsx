import { useState } from 'react';
import { Keyboard, ChevronDown, ChevronUp } from 'lucide-react';

export function KeyboardHelp({ theme, isVisible, isExpanded }) {
    const [isHovered, setIsHovered] = useState(false);

    const shortcuts = [
        { key: 'A', description: 'Toggle Add mode' },
        { key: 'S', description: 'Switch to Select mode' },
        { key: 'D', description: 'Delete selected node(s)' },
        { key: 'M', description: 'Multi-Add states' },
        { key: 'I', description: 'Select connected nodes' },
        { key: 'W', description: 'Set as start state' },
        { key: 'T', description: 'Toggle shortcuts menu' },
        { key: 'Enter', description: 'Toggle accepting (Select mode)' },
        { key: '↹', description: 'Cycle through nodes'},
        { key: '←↑→↓', description: 'Pan canvas' },
        { key: 'Ctrl+X', description: 'Cancel Dialog Window' },
        { key: 'Ctrl+Z', description: 'Undo' },
        { key: 'Ctrl+Y', description: 'Redo' },
        { key: 'Right Click', description: 'Deselect edge start' },
    ];

    if (!isVisible) return null;

    const shouldExpand = isExpanded || isHovered;

    return (
        <div
        className="fixed top-20 right-[340px] z-30 rounded-lg shadow-lg"
        style={{
            backgroundColor: theme.panel,
            borderColor: theme.border,
            border: '1px solid',
            maxWidth: '300px'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        <div
            className="w-full px-4 py-2 flex items-center justify-between cursor-default"
            style={{ color: theme.text }}
        >
            <div className="flex items-center gap-2">
            <Keyboard size={18} />
            <span className="font-semibold">Keyboard Shortcuts (t)</span>
            </div>
            {shouldExpand ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {shouldExpand && (
            <div
            className="px-4 pb-3 pt-2 border-t"
            style={{ borderColor: theme.border }}
            >
            {shortcuts.map((shortcut) => (
                <div
                key={shortcut.key}
                className="flex items-start gap-3 py-2 text-sm"
                >
                <kbd
                    className="px-2 py-1 rounded font-mono text-xs whitespace-nowrap"
                    style={{
                    backgroundColor: theme.canvas,
                    color: theme.nodeSelected,
                    border: `1px solid ${theme.border}`
                    }}
                >
                    {shortcut.key}
                </kbd>
                <span style={{ color: theme.text }}>{shortcut.description}</span>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}