import React, { Component, PureComponent } from 'react';

import { View } from 'react-native';

export default class BaseWidget extends (PureComponent || Component) {

  /**
   * 1.内部使用的方法名均以_(下划线)开头的驼峰式命名，外部调用的均以普通驼峰式命名
   */



  /**
   * 獲取随机颜色，一般调试使用 
   */
  getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }
}
