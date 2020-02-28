import React from 'react';
import {StyleSheet, View, Text, AppRegistry} from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Business = () => (
  <View style={styles.container}>
    <Text>{`当前时间${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}`}</Text>
    <Text>RN业务模块1</Text>
  </View>
);

AppRegistry.registerComponent('business1', () => Business);
