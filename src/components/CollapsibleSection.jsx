import { ChevronDown, ChevronUp } from 'lucide-react';

export function CollapsibleSection({ title, icon: Icon, isExpanded, onToggle, theme, children, isDisabled = false }) {
    return (
        <div
            className="border rounded-lg mb-3"
            style={{ borderColor: theme.border }}
        >
            <button
                onClick={onToggle}
                disabled={isDisabled}
                className="w-full px-4 py-3 flex items-center justify-between"
                style={{ color: theme.text }}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={18} style={{ color: theme.nodeSelected }} />}
                    <span className="font-semibold text-sm">{title}</span>
                </div>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isExpanded && (
                <div
                    className="px-4 pb-3 border-t"
                    style={{ borderColor: theme.border }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
