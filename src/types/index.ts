// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}


export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}


export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}


export type RootStackParamList = {
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Settings: undefined;
};
