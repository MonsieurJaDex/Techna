import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useUserStore } from '@/store/useUserStore';

export function TopBar() {
  const user = useUserStore((s) => s.user);

  return (
    <View style={styles.wrap}>
      <Text style={styles.brand}>1221SYSTEMS</Text>

      <Pressable style={({ pressed }) => [styles.search, pressed && { opacity: 0.9 }]}>
        <FontAwesome name="search" size={14} color="#6B7280" />
        <Text style={styles.searchText}>Поиск по сайту</Text>
      </Pressable>

      <View style={styles.right}>
        <Pressable style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.85 }]}>
          <FontAwesome name="bell-o" size={16} color="#111827" />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.85 }]}>
          <FontAwesome name="comment-o" size={16} color="#111827" />
        </Pressable>

        <Pressable style={({ pressed }) => [styles.profilePill, pressed && { opacity: 0.92 }]}>
          <Image
            source={{
              uri: 'https://portal-test.1221systems.ru/wp-content/uploads/xs_cache/resize_img/uploads_xs_avatar_0e1626d679998ddade739b079803ae96-56x56.jpg',
            }}
            style={styles.avatar}
          />
          <Text style={styles.profileText}>{user?.name || 'HR Тестовый'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brand: { fontSize: 16, fontWeight: '900', color: '#111827', letterSpacing: 0.4 },
  search: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F6F7F9',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePill: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#0B0F14',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  avatar: { width: 26, height: 26, borderRadius: 999, backgroundColor: '#111827' },
  profileText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
});

