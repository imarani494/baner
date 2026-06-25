import { useRef } from 'react';
import { Animated } from 'react-native';


export function useAnimatedValue(initial: number): Animated.Value {
  return useRef(new Animated.Value(initial)).current;
}
