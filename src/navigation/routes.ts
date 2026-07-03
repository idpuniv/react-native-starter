import type {
  RootStackParamList,
  MainTabParamList,
} from '@/types';

// Re-export des types pour éviter d'importer depuis @/types dans les navigateurs
export type { RootStackParamList, MainTabParamList };

// Noms des routes centralisés — évite les typos dans les navigate()
export const ROOT_ROUTES = {
  MAIN: 'Main',
} as const satisfies Record<string, keyof RootStackParamList>;


export const MAIN_ROUTES = {
  DASHBOARD: 'Dashboard',
  SETTINGS:  'Settings',
} as const satisfies Record<string, keyof MainTabParamList>;
