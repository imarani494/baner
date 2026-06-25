import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Text } from './Text';
import { palette, fontWeight } from '../../theme';

interface AvatarProps {
  initials: string;
  size?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

const GRADIENT_PAIRS = [
  [palette.primary, '#A89CFF'],
  [palette.secondary, '#FF9BAF'],
  [palette.accent, '#39C26B'],
  [palette.info, '#0097CC'],
];

function getColor(initials: string) {
  const idx = initials.charCodeAt(0) % GRADIENT_PAIRS.length;
  return GRADIENT_PAIRS[idx][0];
}

export function Avatar({ initials, size = 44, backgroundColor, style }: AvatarProps) {
  const bg = backgroundColor ?? getColor(initials);
  const fontSize = size * 0.38;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
        style,
      ]}
      accessibilityLabel={`Avatar: ${initials}`}
    >
      <Text
        style={{ fontSize, fontWeight: fontWeight.bold, color: palette.white }}
      >
        {initials.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
