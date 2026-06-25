import { useCallback } from 'react';
import { Animated } from 'react-native';
import { useAnimatedValue } from './useAnimatedValue';

export function usePressAnimation(scaleTo = 0.95) {
  const scale = useAnimatedValue(1);

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  }, [scale, scaleTo]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
