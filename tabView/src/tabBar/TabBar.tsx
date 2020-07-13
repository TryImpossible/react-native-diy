'use strict';

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Animated,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  Easing,
  processColor,
  LayoutRectangle,
} from 'react-native';
import TabItem, { TabItemProps, RouteProps } from './TabItem';
import Indicator from './Indicator';

interface EndResult {
  finished: boolean;
}
type EndCallback = (result: EndResult) => void;

export interface CompositeAnimation {
  /**
   * Animations are started by calling start() on your animation.
   * start() takes a completion callback that will be called when the
   * animation is done or when the animation is done because stop() was
   * called on it before it could finish.
   *
   * @param callback - Optional function that will be called
   *      after the animation finished running normally or when the animation
   *      is done because stop() was called on it before it could finish
   *
   * @example
   *   Animated.timing({}).start(({ finished }) => {
   *    // completion callback
   *   });
   */
  start: (callback?: EndCallback) => void;
  /**
   * Stops any running animation.
   */
  stop: () => void;
  /**
   * Stops any running animation and resets the value to its original.
   */
  reset: () => void;
}

const styles = StyleSheet.create({
  tabBar: {
    minHeight: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    height: '100%',
    paddingVertical: 8,
  },
});

// function getInterpolate(
//   tabs: Array<{ key: string; title: string }>,
//   index: number,
//   isActive: boolean,
//   category: 'color' | 'scale',
// ) {
//   const inputRange: Array<number | string> = [];
//   const outputRange: Array<number | string> = [];
//   tabs.forEach((item, i) => {
//     inputRange.push(i);
//     if (category === 'color') {
//       outputRange.push(isActive && i === index ? '#000000' : '#333333');
//     }
//     if (category === 'scale') {
//       outputRange.push(isActive && i === index ? 1.5 : 1);
//     }
//   });
//   return { inputRange, outputRange };
// }

interface TabBarProps extends Omit<TabItemProps, 'style' | 'onTabLayout' | 'onLabelLayout' | 'onPress' | 'route'> {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  activeColor?: string;
  inactiveColor?: string;
  renderLabel?: ({ route, isActive }: { route: RouteProps; isActive?: boolean }) => React.ReactNode;
  renderIcon?: ({ route, isActive }: { route: RouteProps; isActive?: boolean }) => React.ReactNode;
  renderBadge?: ({ route, isActive }: { route: RouteProps; isActive?: boolean }) => React.ReactNode;
  renderIndicator?: ({
    indexValue,
    leftValue,
    widthValue,
  }: {
    indexValue: Animated.Value;
    leftValue: Animated.Value;
    widthValue: Animated.Value;
  }) => React.ReactNode;
  renderLeftSection?: () => React.ReactNode;
  renderRightSection?: () => React.ReactNode;
  routes: Array<RouteProps>;
  bounces?: boolean;
  scrollEnabled?: boolean;
  initialIndex?: number;
  onTabPress?: (index: number) => void;
  onTabChange?: (index: number) => void;
  indicatorMode?: 'tab' | 'label';
  indicatorWidthRatio?: number;
  tabMode?: 'scrollable' | 'fixed';
}

interface TabBarState {
  selectedIndex: number;
}

class TabBar extends React.PureComponent<TabBarProps, TabBarState> {
  static defaultProps = {
    initialIndex: 0,
    bounces: true,
    scrollEnabled: true,
    indicatorMode: 'tab',
    indicatorWidthRatio: 1,
    tabMode: 'fixed',
  };

  indexValue: Animated.Value;
  indicatorWidthValue: Animated.Value;
  indicatorLeftValue: Animated.Value;
  labelColorValue: Animated.Value;
  labelScaleValue: Animated.Value;
  scrollView: React.RefObject<ScrollView>;
  scrollViewWidth: number;
  scrollViewHeight: number;
  tabItemLayout: { [key: number]: LayoutRectangle } = {};
  tabLabelLayout: { [key: number]: LayoutRectangle } = {};
  timer: NodeJS.Timeout | null;
  selectedIndex: number;
  pressTime: number;

  constructor(props: TabBarProps) {
    super(props);
    this.indexValue = new Animated.Value(0);
    this.indicatorWidthValue = new Animated.Value(0);
    this.indicatorLeftValue = new Animated.Value(0);
    this.labelColorValue = new Animated.Value(processColor('#333333'));
    this.labelScaleValue = new Animated.Value(1.5);
    this.scrollView = React.createRef<ScrollView>();
    this.scrollViewWidth = 0;
    this.scrollViewHeight = 0;
    this.tabItemLayout = {};
    this.timer = null;
    this.selectedIndex = 0;
    this.pressTime = 0;

    this.state = {
      selectedIndex: 0,
    };
  }

  // componentDidMount() {
  //   this.timer = setTimeout(() => {
  //     if (this.state.selectedIndex === -1 && !!this.scrollViewWidth && !!this.scrollViewHeight) {
  //       this.scrollToIndex(this.props.initialIndex || 0);
  //       console.warn('ds');
  //     }
  //   }, 200);
  // }

  // UNSAFE_componentWillReceiveProps(nextProps: TabBarProps) {
  //   console.warn('UNSAFE_componentWillReceiveProps');
  //   if (this.props.routes !== nextProps.routes) {
  //     this.scrollToIndex(this.state.selectedIndex);
  //   }
  // }

  // componentDidUpdate() {
  //   console.warn('componentDidUpdate');
  // }

  // static getDerivedStateFromProps(props, state) {
  //   console.warn('getDerivedStateFromProps');
  //   return null;
  // }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  scrollToIndex(index: number, callback?: () => void) {
    if (index === this.selectedIndex && index !== this.props.initialIndex) {
      return;
    }
    if (!this.tabItemLayout[index] || !this.tabLabelLayout[index]) {
      return;
    }

    const animated = this.props.initialIndex === index || Math.abs(index - this.selectedIndex) === 1;
    const animations: Array<CompositeAnimation> = [];
    const { x, width } = this.tabItemLayout[index];
    const { width: labelWidth } = this.tabLabelLayout[index];
    const { indicatorMode, indicatorWidthRatio = 1 } = this.props;

    let ratio = indicatorWidthRatio % 1;
    ratio = ratio === 0 && indicatorWidthRatio >= 1 ? 1 : ratio;

    let leftValue = x + (width - width * ratio) / 2;
    let widthValue = width * ratio;

    if (indicatorMode === 'label') {
      leftValue = x + (width - labelWidth * ratio) / 2;
      widthValue = labelWidth * ratio;
    }

    if (animated) {
      // animations.push(
      //   Animated.spring(this.indexValue, { toValue: index, friction: 12, tension: 40, useNativeDriver: false }),
      // );
      // animations.push(
      //   Animated.spring(this.indicatorLeftValue, {
      //     toValue: leftValue,
      //     friction: 12,
      //     tension: 40,
      //     useNativeDriver: false,
      //   }),
      // );
      // animations.push(
      //   Animated.spring(this.indicatorWidthValue, {
      //     toValue: widthValue,
      //     friction: 12,
      //     tension: 40,
      //     useNativeDriver: false,
      //   }),
      // );
      animations.push(
        Animated.timing(this.indexValue, {
          toValue: index,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      );
      animations.push(
        Animated.timing(this.indicatorLeftValue, {
          toValue: leftValue,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      );
      animations.push(
        Animated.timing(this.indicatorWidthValue, {
          toValue: widthValue,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      );
    } else {
      animations.push(
        Animated.timing(this.indexValue, {
          toValue: index,
          useNativeDriver: false,
        }),
      );
      animations.push(
        Animated.timing(this.indicatorLeftValue, {
          toValue: leftValue,
          useNativeDriver: false,
        }),
      );
      animations.push(
        Animated.timing(this.indicatorWidthValue, {
          toValue: widthValue,
          useNativeDriver: false,
        }),
      );
    }

    const lastTabItemLayout = this.tabItemLayout[this.props.routes.length - 1];
    if (this.scrollView && lastTabItemLayout) {
      const pageCenterX = (this.scrollViewWidth - width) / 2;
      const firstX = 0 + pageCenterX;
      const lastX = lastTabItemLayout.x - pageCenterX;
      // console.warn(x, pageCenterX, firstX, lastX);

      if (x < firstX) {
        this.scrollView.current && this.scrollView.current.scrollTo({ x: 0, y: 0, animated: true });
      } else if (x > lastX) {
        this.scrollView.current && this.scrollView.current.scrollToEnd({ animated: true });
      } else {
        const dx = x - pageCenterX;
        this.scrollView.current && this.scrollView.current.scrollTo({ x: dx, y: 0, animated: true });
      }
    }

    this.selectedIndex = index;
    this.setState({ selectedIndex: index });
    Animated.parallel(animations).start(callback);
  }

  render() {
    const {
      style,
      contentContainerStyle,
      tabStyle,
      labelStyle,
      indicatorStyle,
      activeColor,
      inactiveColor,
      renderLabel,
      renderIcon,
      renderBadge,
      renderIndicator,
      renderLeftSection,
      renderRightSection,
      routes,
      bounces,
      scrollEnabled,
      onTabPress,
      onTabChange,
      tabMode,
    } = this.props;
    const { selectedIndex } = this.state;
    return (
      <View style={[styles.tabBar, style]}>
        {renderLeftSection && renderLeftSection()}
        <ScrollView
          style={{ flex: 1, height: '100%' }}
          ref={this.scrollView}
          contentContainerStyle={[
            styles.contentContainerStyle,
            contentContainerStyle,
            tabMode === 'fixed' ? { width: '100%' } : {},
          ]}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          bounces={bounces}
          onLayout={({
            nativeEvent: {
              layout: { width, height },
            },
          }) => {
            this.scrollViewWidth = width;
            this.scrollViewHeight = height;
          }}
        >
          {routes.map((route: RouteProps, index: number) => {
            const isActive = index === selectedIndex;
            return (
              <TabItem
                route={route}
                style={[tabStyle, tabMode === 'fixed' ? { flex: 1 } : {}]}
                key={`TabItem${String(index)}`}
                onTabLayout={({ nativeEvent: { layout } }) => {
                  // console.warn(`tabItem${index}Layout`, layout);
                  this.tabItemLayout[index] = layout;
                }}
                onLabelLayout={({ nativeEvent: { layout } }) => {
                  // console.warn(`tabItem${index}Layout`, layout);
                  this.tabLabelLayout[index] = layout;
                }}
                isActive={isActive}
                activeColor={activeColor}
                inactiveColor={inactiveColor}
                onPress={() => {
                  if (Date.now() - this.pressTime >= 600) {
                    this.pressTime = Date.now();
                    onTabPress && onTabPress(index);
                    this.scrollToIndex(index, () => {
                      onTabChange && onTabChange(index);
                    });
                  }
                }}
                labelStyle={labelStyle}
                colorValue={this.labelColorValue}
                scaleValue={this.labelScaleValue}
                renderLabel={renderLabel}
                renderIcon={renderIcon}
                renderBadge={renderBadge}
              />
            );
          })}
          {renderIndicator ? (
            renderIndicator({
              indexValue: this.indexValue,
              leftValue: this.indicatorLeftValue,
              widthValue: this.indicatorWidthValue,
            })
          ) : (
            <Indicator
              style={indicatorStyle}
              leftValue={this.indicatorLeftValue}
              widthValue={this.indicatorWidthValue}
            />
          )}
        </ScrollView>
        {renderRightSection && renderRightSection()}
      </View>
    );
  }
}

export default TabBar;
