import * as React from 'react';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = PressableProps & {
  title: string;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export function Button({ title, disabled, style, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style as any,
      ]}
      {...rest}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6AB216',
  },
  text: {
    color: '#0B1A04',
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

