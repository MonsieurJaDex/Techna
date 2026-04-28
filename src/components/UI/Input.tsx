import * as React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & {
  rightSlot?: React.ReactNode;
};

export function Input({ rightSlot, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <TextInput
        placeholderTextColor="#6B7280"
        style={[styles.input, style]}
        {...rest}
      />
      {!!rightSlot && <View style={styles.right}>{rightSlot}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 44,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingLeft: 12,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 8,
  },
  right: {
    marginLeft: 6,
  },
});

