import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, usePathname } from 'expo-router';
import * as React from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

type Item = {
  href: string;
  label: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
};

const ITEMS: Item[] = [
  { href: '/home', label: 'Главная', icon: 'home' },
  { href: '/chat', label: 'Чат', icon: 'comments' },
  { href: '/contacts', label: 'Контакты', icon: 'users' },
  { href: '/thanks', label: 'Отправить благодарочку', icon: 'heart' },
  { href: '/learning', label: 'Обучение', icon: 'graduation-cap' },
  { href: '/links', label: 'Полезные ссылки', icon: 'link' },
  { href: '/benefits', label: 'Кафетерий льгот', icon: 'gift' },
  { href: '/career', label: 'Карьера', icon: 'rocket' },
  { href: '/store', label: '12:21 Store', icon: 'shopping-bag' },
];

const GREEN = '#6AB216';
const HOVER_BG = '#EAF7D5';

export function Sidebar() {
  const pathname = usePathname();
  // Portal sidebar on web is icon-first; expand only on hover.
  const [expanded, setExpanded] = React.useState(Platform.OS !== 'web');
  const widthAnim = React.useRef(new Animated.Value(expanded ? 252 : 72)).current;

  React.useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: expanded ? 252 : 72,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [expanded, widthAnim]);

  return (
    <Animated.View
      onPointerEnter={Platform.OS === 'web' ? () => setExpanded(true) : undefined}
      onPointerLeave={Platform.OS === 'web' ? () => setExpanded(false) : undefined}
      style={[styles.wrap, { width: widthAnim }]}>
      <View style={styles.items}>
        {ITEMS.map((it) => {
          const active = pathname === it.href || (it.href !== '/home' && pathname.startsWith(it.href));
          return (
            <Link key={it.href} href={it.href} asChild>
              <Pressable style={({ hovered, pressed }) => [
                styles.item,
                (hovered || active) && { backgroundColor: HOVER_BG },
                pressed && { opacity: 0.85 },
              ]}>
                <FontAwesome name={it.icon} size={20} color={active ? GREEN : '#111827'} style={styles.icon} />
                {expanded && <Text numberOfLines={1} style={styles.label}>{it.label}</Text>}
              </Pressable>
            </Link>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
  },
  items: { paddingHorizontal: 10, gap: 14 },
  item: {
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: { width: 22, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '800', color: '#111827' },
});

