"use strict";

import React from "react";
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageURISource,
  ImageRequireSource,
} from "react-native";
import ViewPager from "@react-native-community/viewpager";
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

  viewPagerRef: React.RefObject<ViewPager>;
  sceneRefs: { [key: number]: any };
  visibleSceneIndexs: Array<number>;
  selectedIndex: number;

  constructor(props: MyViewPagerProps) {
    super(props);
    const { initialIndex = 0 } = props;
    this.viewPagerRef = React.createRef<ViewPager>();
    this.sceneRefs = {};
    this.visibleSceneIndexs = [initialIndex];
    this.selectedIndex = initialIndex;
  }

  componentWillUnmount() {
    this.sceneRefs = [];
    this.visibleSceneIndexs = [];
  }

  scrollToIndex(index: number) {
    if (index === this.selectedIndex) {
      return;
    }
    if (this.viewPagerRef.current) {
      const animated = Math.abs(index - this.selectedIndex) === 1;
      if (animated) {
        this.viewPagerRef.current.setPage(index);
      } else {
        this.viewPagerRef.current.setPageWithoutAnimation(index);
      }
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
      onSwipeStart,
      onSwipeEnd,
      initialIndex,
      lazy,
      sceneContainerStyle,
      renderLazyPlaceholder,
      keyboardDismissMode,
    } = this.props;
    return (
      <ViewPager
        ref={this.viewPagerRef}
        style={[styles.viewPager, StyleSheet.flatten(style)]}
        initialPage={initialIndex}
        keyboardDismissMode={keyboardDismissMode}
        scrollEnabled={swipeEnabled}
        onPageScroll={({ nativeEvent: { position, offset } }) => {
          // console.warn('onPageScroll');
          onPagerScroll && onPagerScroll(position, offset);
        }}
        onPageSelected={({ nativeEvent: { position } }) => {
          // console.warn('onPageSelected');
          this.selectedIndex = position;
          if (!this.visibleSceneIndexs.includes(position)) {
            this.sceneRefs[position] &&
              this.sceneRefs[position].onVisibilityLoad();
          }
          onIndexChange && onIndexChange(position, () => {});
        }}
        onPageScrollStateChanged={({ nativeEvent: { pageScrollState } }) => {
          // console.warn('onPageScrollStateChanged', pageScrollState);
          if (pageScrollState === "dragging") {
            onSwipeStart && onSwipeStart();
          }
          if (pageScrollState === "idle") {
            onSwipeEnd && onSwipeEnd();
          }
        }}
        orientation="horizontal"
        transitionStyle="scroll"
      >
        {routes.map((route, index) => {
          return (
            <Scene
              key={`Scene${index}`}
              getRef={(ref) => {
                this.sceneRefs[index] = ref;
              }}
              style={sceneContainerStyle}
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
      </ViewPager>
    );
  }
}

export default MyViewPager;
