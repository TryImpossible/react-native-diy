import React from 'react';

import { View, Text, Animated, Easing, StyleSheet, ViewPropTypes, ColorPropType } from 'react-native';

import BaseWidget from './BaseWidget';

import PropTypes from 'prop-types';

import Const, { getSize, __IOS__, __ANDROID__ } from './Const';

const IndicaterHeight = getSize(30); //高度

const IndicaterBackgroundColor = 0x00000050; //背景

export const IndicaterMode = { none: 'NONE', dot: 'DOT', number: 'NUMBER', title: 'TITLE', titleWithDot: 'TITLEWIDTHDOT', titleWithNumber: 'TITLEWIDTHNUMBER' }; //Indicater 模式

export const IndicaterAlign = { left: 'flex-start', center: 'center', 'right': 'flex-end' }; //对齐方式

export default class Indicater extends BaseWidget {

  static propTypes = {
    style: ViewPropTypes.style, //Indicater样式
    count: PropTypes.number, //数量
    title: PropTypes.array, //描述
    initialIndex: PropTypes.number, //选中值
    dotStyle: ViewPropTypes.style, //dot样式
    numberStyle: ViewPropTypes.style, //number样式
    titleStyle: ViewPropTypes.style, //title样式
    mode: PropTypes.oneOf(Object.values(IndicaterMode)), //Indicater 模式
    align: PropTypes.oneOf(Object.values(IndicaterAlign)), //Indicater 对齐方式
    activeColor: ColorPropType,  //非選中的顏色 
    inactiveColor: ColorPropType, //選中的顏色
  }

  static defaultProps = {
    count: 3,
    title: ['Android', 'IOS', 'ReactNative'],
    initialIndex: 0,
    activeColor: 'white',
    inactiveColor: 'grey',
    mode: 'DOT',
    align: 'center'
  }

  constructor(props) {
    super(props);
    this.points = Array(props.count).fill('Indicater');
    this.path = new Animated.Value(0);
    this.dotPath = new Animated.Value(0);
    this.state = {
      currentIndex: props.initialIndex,
    }
  }

  renderNoneView() {
    return <View />
  }

  getInterpolate(index) {
    let { count, activeColor, inactiveColor } = this.props;
    let inputRange = [];
    let outputRange = [];
    this.points && this.points.map((item, i) => {
      inputRange.push(i);
      outputRange.push(i !== index ? inactiveColor : activeColor);
    });
    return { inputRange, outputRange };
  }

  /**
   * 浮动点
   */
  renderDotView() {

    let { style, count, dotStyle, align } = this.props;
    const bottom = this.path.interpolate({
      inputRange: [0, 1],
      outputRange: [-IndicaterHeight, 0]
    })
    return (
      <Animated.View style={[styles.container, { ...style, justifyContent: align, bottom, opacity: this.path }]} pointerEvents={'box-none'}>
        <View style={styles.dotContainer}>
          {
            this.points.map((item, index) => {
              let backgroundColor = this.dotPath.interpolate(this.getInterpolate(index));
              let marginRight = index !== this.points.length - 1 ? getSize(8) : 0;
              return (
                <Animated.View
                  key={`PointView${index}`}
                  style={[styles.dot, { ...dotStyle, backgroundColor, marginRight }]}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={() => '暂时不做点击功能'} />
              )
            })
          }
        </View>
      </Animated.View>
    );
  }

  /**
   * 数字 
   */
  renderNumberView() {

    let { style, count, numberStyle, align } = this.props;
    const bottom = this.path.interpolate({
      inputRange: [0, 1],
      outputRange: [-IndicaterHeight, 0]
    })
    return (
      <Animated.View style={[styles.container, { ...style, justifyContent: align, bottom, opacity: this.path }]} pointerEvents={'box-none'}>
        <Text numberOfLines={1} style={[styles.number, { ...styles.numberStyle }]}>{`${this.state.currentIndex + 1} / ${count}`}</Text>
      </Animated.View>
    )
  }

  /**
   * 标题
   */
  renderTitleView() {
    let { style, titleStyle, title, align } = this.props;
    const bottom = this.path.interpolate({
      inputRange: [0, 1],
      outputRange: [-IndicaterHeight, 0]
    })
    return (
      <Animated.View style={[styles.container, { ...style, justifyContent: align, bottom, opacity: this.path }]} pointerEvents={'box-none'}>
        <Text numberOfLines={1} style={[styles.title, { ...titleStyle }]}>{title[this.state.currentIndex]}</Text>
      </Animated.View>
    )
  }

  /**
   * 标题和浮动点
   */
  renderTitleWidthDotView() {

    let { style, titleStyle, dotStyle, title } = this.props;
    const bottom = this.path.interpolate({
      inputRange: [0, 1],
      outputRange: [-IndicaterHeight, 0]
    })
    return (
      <Animated.View style={[styles.container, { ...style, bottom, opacity: this.path }]} pointerEvents={'box-none'} >
        <Text numberOfLines={1} style={[styles.title, { flex: 1, marginRight: getSize(10), ...titleStyle }]}>{title[this.state.currentIndex]}</Text>
        <View style={styles.dotContainer}>
          {
            this.points.map((item, index) => {
              let backgroundColor = this.dotPath.interpolate(this.getInterpolate(index));
              let marginRight = index !== this.points.length - 1 ? getSize(8) : 0;
              return (
                <Animated.View
                  key={`PointView${index}`}
                  style={[styles.dot, { ...dotStyle, backgroundColor, marginRight }]}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={() => '暂时不处理'} />
              )
            })
          }
        </View>
      </Animated.View>
    )
  }

  /**
   * 标题和数字 
   */
  renderTitleWithNumberView() {

    let { style, count, titleStyle, numberStyle, title } = this.props;
    const bottom = this.path.interpolate({
      inputRange: [0, 1],
      outputRange: [-IndicaterHeight, 0]
    })
    return (
      <Animated.View style={[styles.container, { ...style, bottom, opacity: this.path }]} pointerEvents={'box-none'}>
        <Text numberOfLines={1} style={[styles.title, { flex: 1, marginRight: getSize(10), ...titleStyle }]}>{title[this.state.currentIndex]}</Text>
        <Text style={[styles.number, { ...numberStyle }]}>{`${this.state.currentIndex + 1} / ${count}`}</Text>
      </Animated.View>
    )
  }

  render() {
    const { mode } = this.props;
    switch (mode) {
      case IndicaterMode.none:
        return this.renderNoneView();
        break;
      case IndicaterMode.dot:
        return this.renderDotView();
        break;
      case IndicaterMode.number:
        return this.renderNumberView();
        break;
      case IndicaterMode.title:
        return this.renderTitleView();
        break;
      case IndicaterMode.titleWithDot:
        return this.renderTitleWidthDotView();
        break;
      case IndicaterMode.titleWithNumber:
        return this.renderTitleWithNumberView();
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    this.show();
  }

  /**
   * 显示，一般外部调用
   */
  show() {
    Animated.timing(this.path, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear
    }).start();
  }

  /**
   * 切换，一般外部调用
   * @param {*} index 
   */
  scrollTo(index) {
    Animated.spring(this.dotPath, {
      toValue: index,
      duration: 50,
      easing: Easing.linear
    }).start();
    this.state.currentIndex !== index && this.setState({ currentIndex: Math.round(index) });
  }

}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getSize(10),
    minHeight: IndicaterHeight,
    backgroundColor: IndicaterBackgroundColor
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dot: {
    width: getSize(6),
    height: getSize(6),
    borderRadius: getSize(3),
  },
  title: {
    fontSize: getSize(13),
    color: '#fff',
  },
  number: {
    fontSize: getSize(13),
    color: '#fff',
  }
}); 