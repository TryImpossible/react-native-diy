'use strict';

import React from 'react';
import { StyleSheet, Animated, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 15,
    marginHorizontal: 12,
  },
});

export interface LabelProps {
  style?: StyleProp<ViewStyle>;
  isActive?: boolean;
  colorValue?: Animated.Value;
  scaleValue?: Animated.Value;
  label?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const Label: React.FC<LabelProps> = ({
  style,
  //  colorValue,
  //  scaleValue,
  isActive,
  label,
  onLayout,
}) => {
  return (
    <Animated.Text
      // ref={(ref) => (this[`label${index}`] = ref)}
      onLayout={onLayout}
      style={[
        styles.labelStyle,
        {
          fontWeight: isActive ? 'bold' : 'normal',
          // color: colorValue,
          // transform: [{ scale: scaleValue }],
          color: isActive ? '#000000' : '#333333',
          transform: [{ scale: isActive ? 1.2 : 1 }],
        },
        style,
      ]}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {label}
    </Animated.Text>
  );
};

Label.defaultProps = {
  isActive: false,
};

export default Label;
