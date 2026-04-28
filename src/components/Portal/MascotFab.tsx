import * as React from 'react';
import { Asset } from 'expo-asset';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const mascotAsset = require('../../../assets/images/msctc.png');

export function MascotFab(props: {
  onPress: () => void;
  /** Extra distance from the viewport right edge (e.g. clear calendar rail). */
  rightInset?: number;
  bottomInset?: number;
}) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const [uri, setUri] = React.useState<string | null>(null);
  const right = 34 + (props.rightInset ?? 0);
  const bottom = 34 + (props.bottomInset ?? 0);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const asset = Asset.fromModule(mascotAsset);
        await asset.downloadAsync();
        const resolved = asset.localUri || asset.uri;
        if (!cancelled) setUri(resolved || null);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Mascot asset resolve failed', e);
        if (!cancelled) setImgFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const mascotSource = uri ? ({ uri } as const) : null;

  return (
    <View style={[styles.wrap, { right, bottom }]} pointerEvents="box-none">
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>Привет! Чем могу помочь?</Text>
        <View style={styles.tail} />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={props.onPress}
        style={({ hovered, pressed }) => [
          styles.btn,
          hovered && styles.btnHover,
          pressed && styles.btnPressed,
        ]}>
        <View style={styles.imgPad}>
          {imgFailed ? (
            <Text style={styles.fallback}>Чат</Text>
          ) : mascotSource ? (
            <Image
              source={mascotSource as any}
              style={styles.img}
              resizeMode="contain"
              onError={(e) => {
                // eslint-disable-next-line no-console
                console.error('Mascot image failed to load', e?.nativeEvent);
                setImgFailed(true);
              }}
            />
          ) : (
            <Text style={styles.fallback}>…</Text>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    alignItems: 'flex-end',
    gap: 10,
    zIndex: 999999,
    elevation: 999,
  },
  bubble: {
    maxWidth: 220,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: 'rgba(17,24,39,0.12)',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  bubbleText: { fontSize: 13, fontWeight: '800', color: '#111827', lineHeight: 18 },
  tail: {
    position: 'absolute',
    right: 22,
    bottom: -6,
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    transform: [{ rotate: '45deg' }],
  },
  btn: {
    width: 132,
    height: 132,
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(106,178,22,0.25)',
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  btnHover: {
    transform: [{ translateY: -2 }],
  },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  imgPad: {
    width: 124,
    height: 124,
    borderRadius: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  img: { width: 124, height: 124 },
  fallback: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0B1A04',
    letterSpacing: 0.2,
  },
});
