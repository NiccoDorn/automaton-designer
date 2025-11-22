import { X } from 'lucide-react';

export function KeyboardShortcutsModal({ theme, isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Navigation',
      shortcuts: [
        { key: '←↑→↓', description: 'Pan canvas' },
        { key: '↹ Tab', description: 'Cycle through nodes' },
        { key: 'I', description: 'Select connected nodes' },
      ]
    },
    {
      title: 'Editing',
      shortcuts: [
        { key: 'A', description: 'Toggle Add mode' },
        { key: 'S', description: 'Switch to Select mode' },
        { key: 'D', description: 'Delete selected node(s)' },
        { key: 'M', description: 'Multi-Add states' },
        { key: 'W', description: 'Set as start state' },
        { key: 'Enter', description: 'Toggle accepting state' },
        { key: 'Right Click', description: 'Deselect edge start' },
      ]
    },
    {
      title: 'Tools',
      shortcuts: [
        { key: 'T', description: 'Screenshot mode' },
        { key: 'H', description: 'Show keyboard shortcuts' },
        { key: 'Ctrl + +', description: 'Zoom in' },
        { key: 'Ctrl + -', description: 'Zoom out' },
        { key: 'Ctrl + Wheel', description: 'Zoom in/out' },
        { key: 'Shift + Click', description: 'Multi-select states' },
      ]
    },
    {
      title: 'History',
      shortcuts: [
        { key: 'Ctrl + Z', description: 'Undo' },
        { key: 'Ctrl + Y', description: 'Redo' },
      ]
    },
    {
      title: 'Dialogs',
      shortcuts: [
        { key: 'Ctrl + X', description: 'Cancel dialog window' },
        { key: 'Esc', description: 'Close dialog / Stop simulation' },
      ]
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="rounded-lg shadow-2xl overflow-hidden"
        style={{
          backgroundColor: theme.panel,
          borderColor: theme.border,
          border: '2px solid',
          maxWidth: '900px',
          maxHeight: '80vh',
          width: '90%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b"
          style={{ borderColor: theme.border }}
        >
          <h2
            className="text-xl font-bold"
            style={{ color: theme.text }}
          >
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:opacity-70 transition-opacity"
            style={{ color: theme.text }}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(80vh - 80px)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcutGroups.map((group, idx) => (
              <div key={idx}>
                <h3
                  className="text-sm font-semibold mb-3 uppercase tracking-wide"
                  style={{ color: theme.textSecondary || theme.text }}
                >
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, sidx) => (
                    <div
                      key={sidx}
                      className="flex items-start gap-3"
                    >
                      <kbd
                        className="px-3 py-1.5 rounded font-mono text-xs whitespace-nowrap min-w-[80px] text-center"
                        style={{
                          backgroundColor: theme.canvas,
                          color: theme.nodeSelected,
                          border: `1px solid ${theme.border}`
                        }}
                      >
                        {shortcut.key}
                      </kbd>
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: theme.text }}
                      >
                        {shortcut.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
