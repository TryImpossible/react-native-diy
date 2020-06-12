"use strict";

import React from "react";
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageURISource,
  ImageRequireSource,
  ScrollView,
} from "react-native";
import Scene from "./Scene";

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
});

export type IconType = ImageURISource | ImageRequireSource;

export interface RouteProps {
  key: string;
  title: string;
  icon?: IconType;
  badge?: number;
}

export interface SceneProps {
  route: RouteProps;
  index: number;
  jumpTo: (index: number) => void;
}

export interface MyViewPagerProps {
  style?: StyleProp<ViewStyle>;
  routes: Array<RouteProps>;
  onIndexChange?: (index: number, callback: () => void) => void;
  sceneContainerStyle?: StyleProp<ViewStyle>;
  renderScene: ({ route, index, jumpTo }: SceneProps) => React.ReactNode;
  bounces?: boolean;
  lazy?: boolean;
  lazyPreloadDistance?: number;
  renderLazyPlaceholder?: () => React.ReactNode;
  keyboardDismissMode?: "none" | "on-drag";
  swipeEnabled?: boolean;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  onPagerScroll?: (position: number, offset: number) => void;
  initialIndex?: number;
}

class MyViewPager extends React.PureComponent<MyViewPagerProps> {
  static defaultProps = {
    lazy: true,
    swipeEnabled: true,
    initialIndex: 0,
    renderLazyPlaceholder: () => null,
    keyboardDismissMode: "on-drag",
  };

  scrollViewRef: React.RefObject<ScrollView>;
  contentWidth: number;
  timer: NodeJS.Timeout | null;
  sceneRefs: { [key: number]: any };
  visibleSceneIndexs: Array<number>;
  selectedIndex: number;

  constructor(props: MyViewPagerProps) {
    super(props);
    const { initialIndex = 0 } = props;
    this.scrollViewRef = React.createRef<ScrollView>();
    this.contentWidth = 0;
    this.timer = null;
    this.sceneRefs = {};
    this.visibleSceneIndexs = [initialIndex];
    this.selectedIndex = initialIndex;
  }

  componentDidMount() {
    // NOTE: 实现initialPage功能
    const { initialIndex = 0, onIndexChange } = this.props;
    this.timer = setTimeout(() => {
      if (initialIndex === 0) {
        onIndexChange && onIndexChange(0, () => {});
      }
      if (initialIndex > 0) {
        this.scrollViewRef.current &&
          this.scrollViewRef.current.scrollTo({
            x: this.contentWidth * initialIndex,
            animated: false,
          });
      }
    }, 100);
    Object.values(this.sceneRefs).forEach(
      (ref) => ref && ref.setNativeProps({ style: { width: __WIDTH__ } })
    );
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
    this.sceneRefs = [];
    this.visibleSceneIndexs = [];
  }

  scrollToIndex(index: number) {
    if (index === this.selectedIndex) {
      return;
    }
    if (this.scrollViewRef.current) {
      const animated = Math.abs(index - this.selectedIndex) === 1;
      this.scrollViewRef.current &&
        this.scrollViewRef.current.scrollTo({
          x: this.contentWidth * index,
          animated,
        });
    }

    this.selectedIndex = index;
    if (!this.visibleSceneIndexs.includes(index)) {
      this.sceneRefs[index] && this.sceneRefs[index].onVisibilityLoad();
    }
  }

  render() {
    const {
      style,
      routes,
      onIndexChange,
      renderScene,
      swipeEnabled,
      onPagerScroll,
      // onSwipeStart,
      // onSwipeEnd,
      initialIndex,
      bounces,
      lazy,
      sceneContainerStyle,
      renderLazyPlaceholder,
      keyboardDismissMode,
    } = this.props;
    return (
      <ScrollView
        ref={this.scrollViewRef}
        style={[styles.viewPager, StyleSheet.flatten(style)]}
        // keyboardShouldPersistTaps="always"
        horizontal
        bounces={bounces}
        scrollEnabled={swipeEnabled}
        pagingEnabled
        alwaysBounceHorizontal
        keyboardDismissMode={keyboardDismissMode}
        showsHorizontalScrollIndicator={false}
        // scrollEventThrottle={16}
        onLayout={({
          nativeEvent: {
            layout: { width },
          },
        }) => {
          this.contentWidth = width;
        }}
        onScroll={({
          nativeEvent: {
            contentOffset: { x },
            layoutMeasurement: { width },
          },
        }) => {
          const position = Math.floor(x / width);
          const offset = x % width;
          onPagerScroll && onPagerScroll(position, offset);
          this.selectedIndex = position;
          if (!this.visibleSceneIndexs.includes(position)) {
            this.sceneRefs[position] &&
              this.sceneRefs[position].onVisibilityLoad();
          }
          onIndexChange && onIndexChange(position, () => {});
        }}
        // onScrollBeginDrag={() => {
        //   // web不支持
        //   console.warn('onScrollBeginDrag');
        // }}
        // onScrollEndDrag={() => {
        //   // web不支持
        //   console.warn('onScrollEndDrag');
        // }}
        // onMomentumScrollBegin={() => {
        //   // web不支持
        //   console.warn('onMomentumScrollBegin');
        // }}
        // onMomentumScrollEnd={({
        //   nativeEvent: {
        //     contentOffset: { x },
        //     layoutMeasurement: { width },
        //   },
        // }) => {
        //   // web不支持
        //   console.warn('onMomentumScrollEnd');
        //   const index = Math.floor(x / width);
        //   this.selectedIndex = index;
        //   if (!this.visibleSceneIndexs.includes(index)) {
        //     this.sceneRefs[index] && this.sceneRefs[index].onVisibilityLoad();
        //   }
        //   onIndexChange && onIndexChange(index, () => {});
        // }}
      >
        {routes.map((route, index) => {
          return (
            <Scene
              key={`Scene${index}`}
              getRef={(ref) => {
                this.sceneRefs[index] = ref;
              }}
              style={[sceneContainerStyle, { flexGrow: 1 }]}
              placeholder={renderLazyPlaceholder && renderLazyPlaceholder()}
              visible={!lazy || index === initialIndex}
            >
              {renderScene({
                route,
                index,
                jumpTo: (positon) => this.scrollToIndex(positon),
              })}
            </Scene>
          );
        })}
      </ScrollView>
    );
  }
}

export default MyViewPager;
