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
  PixelRatio
} from 'react-native';

import ScrollableTabView from 'react-native-enhance-scrollable-tab-view';

const tabs = ['劉備', '诸葛亮', '关羽', '张飞', '马超', '黄忠', '赵云', '司马懿', '許褚'];

/**
  * 獲取随机颜色，一般调试使用 
  */
const getRandomColor = () => {

  // return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6); //有坑
  // return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6); //有坑 

  // let r = Math.floor(Math.random() * 256);
  // let g = Math.floor(Math.random() * 256);
  // let b = Math.floor(Math.random() * 256);
  // return `rgb(${r},${g},${b})`;

  //颜色字符串  
  var colorStr = "#";
  //字符串的每一字符的范围  
  var randomArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  //产生一个六位的字符串  
  for (var i = 0; i < 6; i++) {
    //15是范围上限，0是范围下限，两个函数保证产生出来的随机数是整数  
    colorStr += randomArr[Math.ceil(Math.random() * (15 - 0) + 0)];
  }
  return colorStr;
}


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <ScrollableTabView
        style={{ marginTop: 30 }}
        tabs={tabs}
    // renderTabBar={() => {
    //   return (
    //     tabs.map((item, index) => <Text>{item}</Text> )
    //   )
    // }}
      >
        {
          tabs.map((item, index) => {
            return (
              <View key={`ScrollableView${index}`} style={{ width: PixelRatio.get('window').width, backgroundColor: getRandomColor(), justifyContent: 'center', alignItems: 'center' }}>
                <Text>{item}</Text>
              </View>
            )
          })
        }
      </ScrollableTabView>
    )
  }
}

