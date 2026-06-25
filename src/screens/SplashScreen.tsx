import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { useNavigation } from '../navigation/NavigationContext';
import { Text } from '../components/ui/Text';
import { palette, fontWeight } from '../theme';

const { width, height } = Dimensions.get('window');

export function SplashScreen() {
  const { replace } = useNavigation();
  const logoScale = useAnimatedValue(0.4);
  const logoOpacity = useAnimatedValue(0);
  const taglineOpacity = useAnimatedValue(0);
  const bgCircle1 = useAnimatedValue(0);
  const bgCircle2 = useAnimatedValue(0);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(bgCircle1, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(bgCircle2, { toValue: 1, duration: 800, delay: 100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, bounciness: 10 }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => replace('Login'), 800);
    });
  }, []); 

  return (
    <View style={styles.container} accessibilityLabel="Splash screen">
     
      <Animated.View
        style={[
          styles.bgCircle1,
          { opacity: bgCircle1, transform: [{ scale: bgCircle1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.bgCircle2,
          { opacity: bgCircle2, transform: [{ scale: bgCircle2 }] },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🦉</Text>
        </View>
        <Text
          style={{
            fontSize: 36,
            fontWeight: fontWeight.extrabold,
            color: palette.white,
            marginTop: 16,
            letterSpacing: -0.5,
          }}
        >
          Foto<Text style={{ color: palette.primaryLight, fontSize: 36, fontWeight: fontWeight.extrabold }}>Owl</Text>
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: palette.primaryLight,
            fontWeight: fontWeight.medium,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          AI Photography
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity }]}>
        <Text
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 15,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          Capture. Curate. Create.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: palette.primaryDark,
    top: -width * 0.5,
    right: -width * 0.3,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: `${palette.secondary}30`,
    bottom: -width * 0.3,
    left: -width * 0.2,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoEmoji: {
    fontSize: 52,
  },
  taglineContainer: {
    position: 'absolute',
    bottom: 60,
  },
});
