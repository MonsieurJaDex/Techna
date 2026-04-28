import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import { useUserStore } from '@/store/useUserStore';

export function UserHeader({ onLogout }: { onLogout: () => void }) {
  const user = useUserStore((s) => s.user);

  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <Text style={styles.name}>{user?.name || 'Сотрудник'}</Text>
        <Text style={styles.meta}>
          {user?.department ? `${user.department} · ` : ''}
          {typeof user?.vacationDays === 'number' ? `Отпуск: ${user.vacationDays} дн.` : 'Отпуск: —'}
        </Text>
      </View>

      <Pressable onPress={onLogout} style={({ pressed }) => [styles.logout, pressed && styles.pressed]}>
        <FontAwesome name="sign-out" size={18} color="#111827" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '900', color: '#111827' },
  meta: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  logout: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
});

