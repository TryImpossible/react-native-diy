import React from 'react';

import { View, FlatList, TouchableOpacity, Animated, Easing, Image, StyleSheet, ViewPropTypes } from 'react-native';

import BaseWidget from './BaseWidget';

import PropTypes from 'prop-types';

import Const, { getSize, __IOS__, __ANDROID__ } from './Const';

export default class BannerView extends BaseWidget {

  static propTypes = {
    style: ViewPropTypes.style, //样式
    width: PropTypes.number.isRequired, //Banner宽度
    height: PropTypes.number, //Banner高度
    initialIndex: PropTypes.number, //初始化Index
    duration: PropTypes.number, //轮播间隔
    autoPlay: PropTypes.bool, //是否自动播放
    autoLoop: PropTypes.bool, //是否轮播
    onScroll: PropTypes.func, //滑动回调
    respondChildEvent: PropTypes.func, //响应子视图事件
  }

  static defaultProps = {
    width: Const.SCREEN_WIDTH,
    height: getSize(150), //默认高度，150
    initialIndex: 0, //默认选中第一张
    duration: 2500, //默认时长
    autoPlay: false, //默认关闭自动播放
    autoLoop: false, //默认关闭轮播 
  }

  constructor(props) {
    super(props);
    this.currentIndex = props.initialIndex;
    this.canRespondChildEvent = true; //默认响应点击事件
  }

  componentDidMount() {
    const { respondChildEvent } = this.props;
    this.autoPlay(); //是否播放
    respondChildEvent && respondChildEvent(this.canRespondChildEvent);
  }

  componentWillUnmount() {
    this.stopPlay();
  }

  autoPlay() {
    if (!this.props.autoPlay) return;

    const { children = [], duration, autoLoop } = this.props;
    const length = children.length;
    this.interval = setInterval(() => {
      if (!autoLoop && this.currentIndex === length - 1) { //不轮播的情况下，播放至最后一张，停止播放
        this.stopPlay();
      } else {
        let nextIndex = this.currentIndex + 1;
        nextIndex = (nextIndex) % length;
        this._scrollTo(nextIndex, true);
      }
    }, duration);
  }

  stopPlay() {
    this.interval && clearInterval(this.interval);
  }

  _scrollTo(index, animated = false) {
    const { widht } = this.props;
    this.bannersFlatList && this.bannersFlatList.scrollToOffset({ animated, offset: index * Const.SCREEN_WIDTH });
  }

  render() {
    let { style, width, height, initialIndex, onScroll, respondChildEvent, children = [] } = this.props;
    return (
      <FlatList
        onTouchStart={() => this.stopPlay()}
        /**
         * 1.拖拽结束时，ios响应onTouchEnd，android响应onTouchCancel
         * 2.点击结束时，ios和android正常响应onTouchEnd
         */
        onTouchEnd={() => this.autoPlay()}
        onTouchCancel={() => this.autoPlay()}
        ref={ref => this.bannersFlatList = ref}
        style={{ ...style }}
        data={children}
        horizontal={true}
        pagingEnabled={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => children[index]}
        keyExtractor={(item, index) => `Banners${index}`}
        onScrollBeginDrag={({ nativeEvent }) => {
          this.canRespondChildEvent = false; //onScrollBeginDrag时，不响应子视图事件
          respondChildEvent && respondChildEvent(this.canRespondChildEvent);
        }}
        onScrollEndDrag={({ nativeEvent }) => {
          this.canRespondChildEvent = true; //onScrollEndDrag时，响应子视图事件
          respondChildEvent && respondChildEvent(this.canRespondChildEvent);

          const offsetX = nativeEvent.contentOffset.x;
          const length = children.length;
          if (offsetX >= (length - 1) * width) {
            this._scrollTo(0);
          } else if (offsetX <= 0) {
            this._scrollTo(length - 1);
          }
        }}
        onMomentumScrollEnd={({ nativeEvent }) => {

        }}
        onScroll={({ nativeEvent }) => {
          const offsetX = nativeEvent.contentOffset.x;
          let percent = (offsetX / width);
          this.currentIndex = Math.floor(percent);
          onScroll && onScroll(percent, this.currentIndex);
        }} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
  }
});