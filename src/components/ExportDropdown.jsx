import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';

export function ExportDropdown({ onExportJSON, onExportPNG, onExportSVG, onExportLaTeX, disabled, theme }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = (exportFn) => {
        exportFn();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="px-4 py-2 rounded-lg text-white font-medium shadow-md transition duration-150 ease-in-out flex items-center gap-2"
                style={{
                    backgroundColor: '#10b981',
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer'
                }}
            >
                <Download size={18} />
                Export
                <ChevronDown size={16} />
            </button>

            {isOpen && !disabled && (
                <div
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50"
                    style={{
                        backgroundColor: theme.panel,
                        border: `2px solid ${theme.border}`
                    }}
                >
                    <button
                        onClick={() => handleExport(onExportJSON)}
                        className="w-full px-4 py-2 text-left text-sm hover:opacity-80 transition rounded-t-lg"
                        style={{ color: theme.text }}
                    >
                        Export as JSON
                    </button>
                    <button
                        onClick={() => handleExport(onExportPNG)}
                        className="w-full px-4 py-2 text-left text-sm hover:opacity-80 transition border-t"
                        style={{ color: theme.text, borderColor: theme.border }}
                    >
                        Export as PNG
                    </button>
                    <button
                        onClick={() => handleExport(onExportSVG)}
                        className="w-full px-4 py-2 text-left text-sm hover:opacity-80 transition border-t"
                        style={{ color: theme.text, borderColor: theme.border }}
                    >
                        Export as SVG
                    </button>
                    <button
                        onClick={() => handleExport(onExportLaTeX)}
                        className="w-full px-4 py-2 text-left text-sm hover:opacity-80 transition border-t rounded-b-lg"
                        style={{ color: theme.text, borderColor: theme.border }}
                    >
                        Export as LaTeX
                    </button>
                </div>
            )}
        </div>
    );
}
