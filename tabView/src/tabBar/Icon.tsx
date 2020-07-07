'use strict';

import React from 'react';
import { StyleSheet, Image, StyleProp, ImageStyle, ImageSourcePropType } from 'react-native';

const styles = StyleSheet.create({
  iconStyle: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
});

export interface IconProps {
  style?: StyleProp<ImageStyle>;
  isActive?: boolean;
  source: ImageSourcePropType;
}

const Icon: React.FC<IconProps> = ({ style, source }) => {
  return <Image style={[styles.iconStyle, style]} source={source} />;
};

Icon.defaultProps = {
  isActive: false,
};

export default Icon;
