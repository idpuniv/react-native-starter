import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

export function Loader({ fullScreen = false, size = 'large' }: LoaderProps) {
  const { theme } = useTheme();

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: theme.background }]}>
        <ActivityIndicator size={size} color={theme.primary} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={theme.primary} />;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
  },
});
