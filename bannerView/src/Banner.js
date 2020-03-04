import React from 'react';

import { View, FlatList, TouchableOpacity, Animated, Easing, Image, StyleSheet, ViewPropTypes, ColorPropType } from 'react-native';

import BaseWidget from './BaseWidget';

import PropTypes from 'prop-types';

import BannerView from './BannerView';

import Indicater, { IndicaterMode, IndicaterAlign } from './Indicater';

import Const, { getSize, __IOS__, __ANDROID__ } from './Const';

export default class Banner extends BaseWidget {

  static propTypes = {
    style: ViewPropTypes.style, //样式
    width: PropTypes.number.isRequired, //Banner宽度
    height: PropTypes.number, //Banner高度
    initialIndex: PropTypes.number, //初始化Index
    onScroll: PropTypes.func, //滚动
    duration: PropTypes.number, //轮播间隔
    autoPlay: PropTypes.bool, //是否自动播放
    autoLoop: PropTypes.bool, //是否轮播

    indicaterStyle: ViewPropTypes.style, //IndicaterStyle样式
    title: PropTypes.array, //描述
    dotStyle: ViewPropTypes.style, //dot样式
    numberStyle: ViewPropTypes.style, //number样式
    titleStyle: ViewPropTypes.style, //title样式
    mode: PropTypes.oneOf(Object.values(IndicaterMode)), //Indicater 模式
    align: PropTypes.oneOf(Object.values(IndicaterAlign)), //Indicater 对齐方式
    activeColor: ColorPropType,  //非選中的顏色 
    inactiveColor: ColorPropType, //選中的顏色
  }

  static defaultProps = {
    width: Const.SCREEN_WIDTH,
    height: getSize(150), //默认高度，150
    initialIndex: 0, //默认选中第一张
    duration: 2500, //默认时长
    autoPlay: true, //默认关闭自动播放
    autoLoop: true, //默认关闭轮播 
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      children = [],
      width,
      height,
      initialIndex,
      onScroll,
      duration,
      autoPlay,
      autoLoop,
      respondChildEvent,
      indicaterStyle,
      title,
      dotStyle,
      numberStyle,
      titleStyle,
      mode,
      align,
      activeColor,
      inactiveColor
    } = this.props;
    return (
      <View style={[styles.container, { width, height }]}>
        <BannerView
          ref={ ref => this.banner = ref }
          style={style}
          width={width}
          height={height}
          initialIndex={initialIndex}
          duration={duration}
          autoPlay={autoPlay}
          autoLoop={autoLoop}
          respondChildEvent={respondChildEvent}
          onScroll={(percent, selectedIndex) => {
            this.indicater && this.indicater.scrollTo(percent);
            onScroll && onScroll(percent, selectedIndex);
          }} >
          {children}
        </BannerView>
        <Indicater
          ref={ref => this.indicater = ref}
          style={{ ...indicaterStyle }}
          count={children.length}
          title={title}
          initialIndex={initialIndex}
          dotStyle={dotStyle}
          titleStyle={titleStyle}
          numberStyle={numberStyle}
          mode={mode}
          align={align}
          activeColor={activeColor}
          inactiveColor={inactiveColor} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});