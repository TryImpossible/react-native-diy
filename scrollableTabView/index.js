
import React, { Component, PureComponent } from 'react';

import { View, Text, Animated, Easing, StyleSheet, ViewPropTypes, ColorPropType } from 'react-native';

import PropTypes from 'prop-types';

import ScrollableTabBar from './src/ScrollableTabBar';

import ScrollableView from "./src/ScrollableView";

import Const, { getSize, __IOS__, __ANDROID__, getRandomColor } from './src/Const';

export const TabBarPosition = { top: 'top', bottom: 'bottom', overlayTop: 'overlayTop', overlayBottom: 'overlayBottom' }

export default class ScrollableTabView extends (PureComponent || Component) {

  static propTypes = {
    style: ViewPropTypes.style, //样式
    tabBarStyle: ViewPropTypes.style, //TabBar樣式
    tabs: PropTypes.array, //Tab数组
    initialIndex: PropTypes.number, //选中的Tab
    onTabChange: PropTypes.func, //Tab切换方法
    tabBarBackgroundColor: ColorPropType, //Tab背景颜色 
    tabBarSpace: PropTypes.number, //每个tab的间距
    tabBarActiveTextColor: ColorPropType, //Tab Text选中的颜色 
    tabBarInactiveTextColor: ColorPropType, //Tab Text非选中的颜色 
    tabBarTextStyle: PropTypes.object, // Tab Text的样式
    tabBarUnderlineStyle: ViewPropTypes.style, // Tab 下划线的样式
    scrollableViewStyle: ViewPropTypes.style, //滾動視圖樣式
    locked: PropTypes.bool, //是否鎖定，不允許滾動
    onScroll: PropTypes.func, //滚动方法
    onScrollEnd: PropTypes.func, //滚动结束方法，即页面选中
    enableScrollAnimation: PropTypes.bool, //是否开启滚动动画

    renderTabBar: PropTypes.func, //若不使用默认的TabBar, 使用此Props传入
    tabBarPosition: PropTypes.oneOf(Object.values(TabBarPosition)), //TabBar位置
  }

  static defaultProps = {
    tabs: ['劉備', '诸葛亮', '关羽', '张飞', '马超', '黄忠', '赵云', '司马懿'],
    tabBarPosition: 'top', //默认'top'
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      children,
      tabBarPosition,
      tabBarStyle,
      tabs,
      initialIndex,
      onTabChange,
      tabBarBackgroundColor,
      tabBarActiveTextColor,
      tabBarInactiveTextColor,
      tabBarTextStyle,
      tabBarUnderlineStyle,
      scrollableViewStyle,
      locked,
      onScroll,
      onScrollEnd,
      enableScrollAnimation,
      renderTabBar
    } = this.props;

    const ScrollableTabBarComponent = (renderTabBar && renderTabBar()) || (
      <ScrollableTabBar
        ref={ref => this.scrollableTabBar = ref}
        style={tabBarStyle}
        tabs={tabs}
        initialTab={initialIndex}
        onTabChange={(index) => {
          this.scrollableView && this.scrollableView.scrollToIndex(index);
          onTabChange && onTabChange(index);
        }}
        tabBarBackgroundColor={tabBarBackgroundColor}
        tabBarActiveTextColor={tabBarActiveTextColor}
        tabBarInactiveTextColor={tabBarInactiveTextColor}
        tabBarTextStyle={tabBarTextStyle}
        tabBarUnderlineStyle={tabBarUnderlineStyle}
        enableScrollAnimation={enableScrollAnimation} />
    )

    const childrenComponent = children || tabs.map((item, index) => {
      return (
        <View key={`ScrollableView${index}`} style={{ width: Const.SCREEN_WIDTH, backgroundColor: getRandomColor(), justifyContent: 'center', alignItems: 'center' }}>
          <Text>{item}</Text>
        </View>
      )
    })

    return (
      <View style={{ ...style }}>
        {tabBarPosition === 'top' ? ScrollableTabBarComponent : null}
        <ScrollableView
          ref={ref => this.scrollableView = ref}
          style={scrollableViewStyle}
          initialPage={initialIndex}
          locked={locked}
          onScroll={(percent) => {
            this.scrollableTabBar && this.scrollableTabBar.changeTabTo(percent);
            onScroll && onScroll(percent);
          }}
          onScrollEnd={onScrollEnd}
          enableScrollAnimation={enableScrollAnimation} >
          {childrenComponent}
        </ScrollableView>
        {tabBarPosition === 'bottom' ? ScrollableTabBarComponent : null}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  }
});

export {
  ScrollableTabBar,
  ScrollableView
};
