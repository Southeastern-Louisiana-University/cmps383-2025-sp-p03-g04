import { TextProps, ViewProps } from "react-native";

export type ThemedTextType =
  | "default"
  | "title"
  | "defaultSemiBold"
  | "subtitle"
  | "link";

export interface ThemedTextProps extends TextProps {
  type?: ThemedTextType;
  style?: any;
}

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export interface AuthContextType {
  user: {
    id: number;
    username: string;
    role: string;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<string>;
  signOut: () => Promise<void>;
  signUp: (
    username: string,
    password: string,
    email?: string
  ) => Promise<string>;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  isTheaterMode: boolean;
  toggleDarkMode: () => void;
  toggleTheaterMode: () => void;
}
