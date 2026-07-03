import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface InputProps extends TextInputProps {
  label?:       string;
  error?:       string;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, ...props }, ref) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
      ? theme.error
      : isFocused
      ? theme.primary
      : theme.border;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: theme.text.secondary }]}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor,
              color: theme.text.primary,
            },
          ]}
          placeholderTextColor={theme.text.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {error && (
          <Text style={[styles.error, { color: theme.error }]}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize:     13,
    fontWeight:   '500',
    marginBottom: 6,
  },
  input: {
    height:        50,
    borderWidth:   1.5,
    borderRadius:  10,
    paddingHorizontal: 14,
    fontSize:      15,
  },
  error: {
    fontSize:  12,
    marginTop: 4,
  },
});
