import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface DividerProps {
  marginVertical?: number;
  marginHorizontal?: number;
}

export function Divider({ marginVertical = 8, marginHorizontal = 0 }: DividerProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth * 2,
        backgroundColor: theme.divider,
        marginVertical,
        marginHorizontal,
      }}
    />
  );
}
