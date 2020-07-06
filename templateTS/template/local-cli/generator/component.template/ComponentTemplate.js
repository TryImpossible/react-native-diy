import React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Theme, Lang } from '../../utilities';
import IMAGES from '../../resources/images';

const styles = StyleSheet.create({
  container: {}
});

const ComponentTemplate = ({ style, children }) => (
  <View style={[styles.container, StyleSheet.flatten(style)]}>{children}</View>
);

ComponentTemplate.propTypes = {
  style: ViewPropTypes.style,
  children: PropTypes.any
};

ComponentTemplate.defaultProps = {};
export default ComponentTemplate;
