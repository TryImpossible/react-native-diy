import React, {Component} from 'react';
import {StyleSheet, View, Text, AppRegistry} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Business extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>RN业务模块2</Text>
      </View>
    );
  }
}
AppRegistry.registerComponent('business2', () => Business);
