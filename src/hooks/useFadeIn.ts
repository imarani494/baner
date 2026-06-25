import { useEffect } from 'react';
import { Animated } from 'react-native';
import { useAnimatedValue } from './useAnimatedValue';

/**

 * @param delay  ms delay before animation starts
 */
export function useFadeIn(delay = 0) {
  const opacity = useAnimatedValue(0);
  const translateY = useAnimatedValue(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return { opacity, translateY };
}
