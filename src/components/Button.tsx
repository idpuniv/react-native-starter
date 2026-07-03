import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Variant = 'primary' | 'outline' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label:       string;
  onPress:     () => void;
  variant?:    Variant;
  size?:       Size;
  isLoading?:  boolean;
  isDisabled?: boolean;
  style?:      ViewStyle;
}

export function Button({
  label,
  onPress,
  variant    = 'primary',
  size       = 'md',
  isLoading  = false,
  isDisabled = false,
  style,
}: ButtonProps) {
  const { theme } = useTheme();
  const disabled = isDisabled || isLoading;

  const containerStyles: ViewStyle[] = [
    styles.base,
    sizeStyles[size],
    variantContainer(variant, theme),
    disabled ? { opacity: 0.5 } : {},
    style ?? {},
  ];

  const textColor = variant === 'primary'
    ? theme.text.inverse
    : theme.primary;

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.text.inverse : theme.primary}
        />
      ) : (
        <Text style={[styles.label, sizeLabel[size], { color: textColor }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Styles helpers ───────────────────────────────────────────────────────────

function variantContainer(variant: Variant, theme: ReturnType<typeof useTheme>['theme']): ViewStyle {
  switch (variant) {
    case 'primary':
      return { backgroundColor: theme.primary };
    case 'outline':
      return { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.primary };
    case 'ghost':
      return { backgroundColor: 'transparent' };
  }
}

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingVertical: 8,  paddingHorizontal: 14, borderRadius: 8  },
  md: { paddingVertical: 13, paddingHorizontal: 20, borderRadius: 10 },
  lg: { paddingVertical: 16, paddingHorizontal: 28, borderRadius: 12 },
};

const sizeLabel: Record<Size, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
};

const styles = StyleSheet.create({
  base: {
    alignItems:     'center',
    justifyContent: 'center',
    flexDirection:  'row',
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
