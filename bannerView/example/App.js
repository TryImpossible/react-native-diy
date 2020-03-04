/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';

import SimpleBanner, { Banner } from 'react-native-bynn-banner';

//测试数据
const BANNER = [
  "https://api.51app.cn/resource/diymall/uu20/special/752ced27.png",
  "https://api.51app.cn/resource/diymall/uu20/special/eaa696ae.png",
  "https://api.51app.cn/resource/diymall/uu20/special/66991c45.png"
];

const { width } = Dimensions.get('window')

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={{ marginTop: 50, alignItems: 'center' }}>
        <Text>{`SimpleBanner`}</Text>
        <SimpleBanner />
        <Text style={{ marginTop: 50, }}>{`Banner`}</Text>
        <Banner
          respondChildEvent={isResponse => {
            this.canResponseChildEvent = isResponse;
          }}>
          {
            BANNER.map((item, index) => {
              return (
                <TouchableOpacity key={`${index}`} activeOpacity={1} onPress={() => {
                  this.canResponseChildEvent && console.log(`点击了${index}`);
                }} >
                  <Image style={{ width, height: 150, backgroundColor: 'red' }} source={{ uri: item }} />
                </TouchableOpacity>
              )
            })
          }
        </Banner>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
