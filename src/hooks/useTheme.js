import { useState } from 'react';

const THEMES = {
    light: {
        name: 'Light',
        canvas: '#f3f4f6',
        background: '#ffffff',
        text: '#1f2937',
        border: '#e5e7eb',
        node: '#f9fafb',
        nodeHover: '#e5e7eb',
        nodeSelected: '#3b82f6',
        nodeStroke: '#64748b',
        edge: '#374151',
        edgeLabel: '#1f2937',
        toolbar: '#ffffff',
        panel: '#ffffff'
    },
    dark: {
        name: 'Dark',
        canvas: '#1f2937',
        background: '#111827',
        text: '#f9fafb',
        border: '#374151',
        node: '#374151',
        nodeHover: '#4b5563',
        nodeSelected: '#60a5fa',
        nodeStroke: '#9ca3af',
        edge: '#d1d5db',
        edgeLabel: '#f9fafb',
        toolbar: '#1f2937',
        panel: '#1f2937'
    },
    tech: {
        name: 'Tech',
        canvas: '#0f172a',
        background: '#020617',
        text: '#22d3ee',
        border: '#0e7490',
        node: '#164e63',
        nodeHover: '#0e7490',
        nodeSelected: '#06b6d4',
        nodeStroke: '#22d3ee',
        edge: '#06b6d4',
        edgeLabel: '#22d3ee',
        toolbar: '#0f172a',
        panel: '#0f172a'
    }
};

export function useTheme() {
    const [theme, setTheme] = useState('light');

    const currentTheme = THEMES[theme];

    const cycleTheme = () => {
        const themeKeys = Object.keys(THEMES);
        const currentIndex = themeKeys.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        setTheme(themeKeys[nextIndex]);
    };

    return { theme, currentTheme, cycleTheme, themeName: currentTheme.name };
}