
import React, { Component, PureComponent } from 'react';

import { Animated, Easing, ViewPagerAndroid, FlatList, ViewPropTypes } from 'react-native';

import PropTypes from 'prop-types';

import Const, { getSize, __IOS__, __ANDROID__ } from './Const';

export default class ScrollableView extends (PureComponent || Component) {

  static propTypes = {
    style: ViewPropTypes.style, //樣式
    initialPage: PropTypes.number, //选中的页面
    locked: PropTypes.bool, //是否鎖定，不允許滾動
    onScroll: PropTypes.func, //滚动方法
    onScrollEnd: PropTypes.func, //滚动结束方法，即页面选中
    enableScrollAnimation: PropTypes.bool, //是否开启滚动动画
  }

  static defaultProps = {
    initialPage: 0, //默认 0
    locked: false, //默认false
    enableScrollAnimation: false //默认false，调用滚动时效果不太好
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { style, initialPage, locked, onScroll, onScrollEnd, children = [] } = this.props;
    if (__IOS__) {
      return (
        <FlatList
          ref={ref => this.flatList = ref}
          style={{ ...style, flexGrow: 1, width: Const.SCREEN_WIDTH }}
          data={children}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          pagingEnabled={true}
          scrollEnabled={!locked}
          onScroll={({ nativeEvent }) => {
            const offsetX = nativeEvent.contentOffset.x; //位移距离
            const percent = offsetX / Const.SCREEN_WIDTH; //移动比例
            onScroll && onScroll(percent);
          }}
          onMomentumScrollEnd={({ nativeEvent }) => {
            const offsetX = nativeEvent.contentOffset.x; //位移距离
            const index = Math.round(offsetX / Const.SCREEN_WIDTH); //选中的页面
            onScrollEnd && onScrollEnd(index);
          }}
          keyExtractor={(item, index) => `ScrollableView${index}`}
          renderItem={({ item, index }) => children[index]}
        />
      )
    } else if (__ANDROID__) {
      return (
        <ViewPagerAndroid
          ref={ref => this.viewPager = ref}
          style={{ ...style, flexGrow: 1, width: Const.SCREEN_WIDTH }}
          scrollEnabled={locked}
          keyboardDismissMode="on-drag"
          onPageScroll={({ nativeEvent }) => {
            const { offset, position } = nativeEvent; 
            onScroll && onScroll(position + offset);
          }}
          onPageSelected={({ nativeEvent }) => {
            const { offset, position } = nativeEvent; 
            onScrollEnd && onScrollEnd(position);
          }} >
          {children}
        </ViewPagerAndroid>
      )
    } else {
      return null;
    }
  }

  /**
   * 滚动方法，一般外部调用
   * @param {*} index 页面索引 
   */
  scrollToIndex(index) {
    const { enableScrollAnimation } = this.props;
    if (__IOS__) {
      this.flatList && this.flatList.scrollToOffset({ animated: enableScrollAnimation, offset: index * Const.SCREEN_WIDTH });;
    } else if (__ANDROID__) {
      if (enableScrollAnimation) {
        this.viewPager && this.viewPager.setPage(index);
      } else {
        this.viewPager && this.viewPager.setPageWithoutAnimation(index);
      }
    }
  }

}
