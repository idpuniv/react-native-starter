import React from 'react';
import { ThemeProvider } from './ThemeProvider';

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Compose tous les providers dans le bon ordre.
 * ThemeProvider en premier
 * Ajouter un nouveau provider ici sans toucher à App.tsx.
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
        {children}
    </ThemeProvider>
  );
}
