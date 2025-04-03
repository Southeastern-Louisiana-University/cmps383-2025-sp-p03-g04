import { TextProps, ViewProps } from 'react-native';

export type ThemedTextType = 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';

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
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}