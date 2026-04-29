import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import * as React from 'react';
import { Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { HoverCard } from '@/components/Portal/HoverCard';
import { MascotFab } from '@/components/Portal/MascotFab';
import { useUserStore } from '@/store/useUserStore';

type NewsItem = {
  title: string;
  dateLabel: string;
  year: string;
  imageUrl: string;
};

function getCalendarMatrix(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayMon0 = (firstOfMonth.getDay() + 6) % 7; // Mon=0..Sun=6

  const weeks: Array<Array<{ day: number | null; isToday: boolean }>> = [];
  let day = 1 - startDayMon0;
  for (let w = 0; w < 6; w++) {
    const row: Array<{ day: number | null; isToday: boolean }> = [];
    for (let i = 0; i < 7; i++) {
      const inMonth = day >= 1 && day <= daysInMonth;
      const isToday =
        inMonth &&
        day === date.getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();
      row.push({ day: inMonth ? day : null, isToday });
      day++;
    }
    weeks.push(row);
    if (day > daysInMonth) break;
  }
  return { year, month, weeks };
}

function CalendarCard() {
  const now = new Date();
  const { year, month, weeks } = React.useMemo(() => getCalendarMatrix(now), []);
  const monthTitle = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date(year, month, 1));
  const todayLabel = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(now);
  const dow = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  return (
    <HoverCard style={styles.calCard} onPress={() => {}}>
      <View style={styles.calHeader}>
        <Text style={styles.calMonth}>
          {monthTitle[0].toUpperCase() + monthTitle.slice(1)}, {year}
        </Text>
        <Text style={styles.calToday}>Сегодня, {todayLabel}</Text>
      </View>

      <View style={styles.calDowRow}>
        {dow.map((d) => (
          <Text key={d} style={styles.calDow}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.calGrid}>
        {weeks.map((row, ri) => (
          <View key={ri} style={styles.calWeek}>
            {row.map((cell, ci) => (
              <View key={ci} style={[styles.calCell, cell.isToday && styles.calCellToday]}>
                <Text style={[styles.calDay, cell.day == null && styles.calDayEmpty, cell.isToday && styles.calDayToday]}>
                  {cell.day ?? ' '}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </HoverCard>
  );
}

const RIGHT_RAIL_WIDTH = 360;
const RIGHT_RAIL_PADDING = 18;

const NEWS: NewsItem[] = [
  {
    title: 'С 8 марта!',
    dateLabel: '8 марта',
    year: '2026',
    imageUrl: 'https://portal-test.1221systems.ru/wp-content/uploads/xs_cache/resize_img/2026_02_snimok-420x230.jpg',
  },
  {
    title: '23 февраля в офисе',
    dateLabel: '27 февраля',
    year: '2026',
    imageUrl:
      'https://portal-test.1221systems.ru/wp-content/uploads/xs_cache/resize_img/2026_02_20210223-scaled-1-420x230.jpg',
  },
  {
    title: 'Новый год 2026',
    dateLabel: '27 февраля',
    year: '2026',
    imageUrl: 'https://portal-test.1221systems.ru/wp-content/uploads/xs_cache/resize_img/2026_02_frame-3-420x230.png',
  },
];

export default function HomeScreen() {
  const token = useUserStore((s) => s.token);
  const { width } = useWindowDimensions();
  const isWide = width >= 1100;
  // Put the mascot on the far right; it will visually overlay the calendar rail.
  const mascotRightClearance = 0;

  React.useEffect(() => {
    if (!token) router.replace('/login');
  }, [token]);

  const content = (
    <>
      <Animated.View entering={FadeInDown.duration(360).damping(18)} style={styles.bannerWrap}>
        <ImageBackground
          source={{ uri: 'https://portal-test.1221systems.ru/wp-content/themes/xs_business/images/background-main.jpg' }}
          style={styles.banner}
          imageStyle={styles.bannerImg}>
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Добро пожаловать на{'\n'}портал!</Text>
          </View>
        </ImageBackground>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(360).damping(18)} style={styles.grid}>
        <HoverCard onPress={() => {}}>
          <View style={styles.portalCard}>
            <Text style={styles.cardTitle}>Документы</Text>
            <Image
              source={{ uri: 'https://portal-test.1221systems.ru/wp-content/uploads/2026/03/docs.png' }}
              style={styles.cardImg}
            />
            <View style={styles.cardArrow}>
              <FontAwesome name="arrow-right" size={18} color="#111827" />
            </View>
          </View>
        </HoverCard>

        <HoverCard onPress={() => {}}>
          <View style={styles.portalCard}>
            <Text style={styles.cardTitle}>Фотогалерея</Text>
            <Image
              source={{ uri: 'https://portal-test.1221systems.ru/wp-content/uploads/2026/03/gallery.png' }}
              style={styles.cardImg}
            />
            <View style={styles.cardArrow}>
              <FontAwesome name="arrow-right" size={18} color="#111827" />
            </View>
          </View>
        </HoverCard>

        <HoverCard onPress={() => {}}>
          <View style={styles.portalCard}>
            <Text style={styles.cardTitle}>12:21STORE</Text>
            <View style={styles.cardImgPlaceholder}>
              <FontAwesome name="shopping-bag" size={46} color="#6AB216" />
            </View>
            <View style={styles.cardArrow}>
              <FontAwesome name="arrow-right" size={18} color="#111827" />
            </View>
          </View>
        </HoverCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(240).duration(360).damping(18)} style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Новости компании</Text>
          <Text style={styles.sectionLink}>Все новости →</Text>
        </View>
        <View style={styles.newsRow}>
          {NEWS.map((n) => (
            <HoverCard key={n.title} style={styles.newsCard} onPress={() => {}}>
              <View style={styles.newsThumbWrap}>
                <ImageBackground source={{ uri: n.imageUrl }} style={styles.newsThumb} imageStyle={styles.newsThumbImg}>
                  <View style={styles.newsThumbFade} />
                </ImageBackground>
              </View>
              <View style={styles.newsBody}>
                <Text style={styles.newsTitle}>{n.title}</Text>
                <View style={styles.newsFooter}>
                  <Text style={styles.newsMeta}>Читать</Text>
                  <FontAwesome name="angle-right" size={18} color="#6AB216" />
                  <View style={{ flex: 1 }} />
                  <Text style={styles.newsDate}>
                    {n.dateLabel}
                    {'\n'}
                    {n.year}
                  </Text>
                </View>
              </View>
            </HoverCard>
          ))}
        </View>
      </Animated.View>
    </>
  );

  return (
    <View style={styles.root}>
      {isWide ? (
        <View style={styles.wideRow}>
          <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>

          <View style={styles.rightRail}>
            <CalendarCard />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
          {content}
          <View style={styles.mobileCalendar}>
            <CalendarCard />
          </View>
        </ScrollView>
      )}

      <MascotFab
        onPress={() => router.push('/chat')}
        rightInset={mascotRightClearance}
        bottomInset={12}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { padding: 18, gap: 16, backgroundColor: '#FFFFFF', paddingBottom: 100 },

  bannerWrap: { width: '100%' },
  banner: { height: 220, borderRadius: 26, overflow: 'hidden' },
  bannerImg: { borderRadius: 26 },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  bannerContent: { flex: 1, padding: 22, justifyContent: 'center' },
  bannerTitle: { fontSize: 44, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.2, lineHeight: 48 },

  wideRow: { flex: 1, flexDirection: 'row' },
  rightRail: {
    width: RIGHT_RAIL_WIDTH,
    padding: RIGHT_RAIL_PADDING,
    borderLeftWidth: 1,
    borderLeftColor: '#EEF0F3',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web'
      ? ({ position: 'sticky', top: 0, height: '100vh' } as any)
      : null),
  },
  mobileCalendar: { marginTop: 6 },

  grid: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  portalCard: { height: 190, width: 260, gap: 14 },
  cardTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
  cardImg: { width: 170, height: 110, resizeMode: 'contain' },
  cardImgPlaceholder: {
    width: 170,
    height: 110,
    borderRadius: 18,
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#EEF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardArrow: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  calCard: { width: '100%', alignSelf: 'flex-start' },
  calHeader: { gap: 6 },
  calMonth: { fontSize: 18, fontWeight: '900', color: '#111827' },
  calToday: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  calDowRow: { marginTop: 12, flexDirection: 'row' },
  calDow: { width: 34, textAlign: 'center', fontSize: 11, fontWeight: '900', color: '#9CA3AF' },
  calGrid: { marginTop: 10, gap: 6 },
  calWeek: { flexDirection: 'row', gap: 6 },
  calCell: {
    width: 34,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#EEF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calCellToday: { backgroundColor: '#EAF7D5', borderColor: 'rgba(106,178,22,0.35)' },
  calDay: { fontSize: 12, fontWeight: '900', color: '#111827' },
  calDayEmpty: { color: 'transparent' },
  calDayToday: { color: '#2E5E06' },

  section: { gap: 10 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
  sectionLink: { fontSize: 13, fontWeight: '800', color: '#6AB216' },
  newsRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  newsCard: { width: 260 },
  newsThumbWrap: { marginBottom: 10, overflow: 'hidden', borderRadius: 18 },
  newsThumb: { height: 130, width: '100%' },
  newsThumbImg: { borderRadius: 18 },
  newsThumbFade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.04)' },
  newsBody: { gap: 10 },
  newsTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  newsFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  newsMeta: { fontSize: 14, fontWeight: '900', color: '#6AB216' },
  newsDate: { fontSize: 14, fontWeight: '800', color: '#6B7280', textAlign: 'right' },
});

