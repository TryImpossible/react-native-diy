import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle, Animated } from 'react-native';
import ViewPager, { RouteProps, SceneProps } from './viewPager/MyViewPager';
import TabBar from './tabBar/TabBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type TabBarPosition = 'top' | 'bottom';

interface TabViewProps {
  style?: StyleProp<ViewStyle>;
  navigationState: Array<RouteProps>;
  renderTabBar?: (props: any) => React.ReactElement | null;
  tabBarPosition?: TabBarPosition;

  tabBarStyle?: StyleProp<ViewStyle>;
  tabBarContentContainerStyle?: StyleProp<ViewStyle>;
  tabBarTabStyle?: StyleProp<ViewStyle>;
  tabBarLabelStyle?: StyleProp<TextStyle>;
  tabBarIndicatorStyle?: StyleProp<ViewStyle>;
  tabBarActiveColor?: string;
  tabBarInactiveColor?: string;
  scrollEnabled?: boolean;
  bounces?: boolean;
  onTabBarPress?: (index: number) => void;
  renderTabBarLabel?: ({ route, isActive }: { route: RouteProps; isActive?: boolean }) => React.ReactNode;
  renderTabBarIcon?: ({ route, isActive }: { route: RouteProps; isActive?: boolean }) => React.ReactNode;
  renderTabBarBadge?: ({ route, isActive }: { route: RouteProps; isActive?: boolean }) => React.ReactNode;
  renderTabBarIndicator?: ({
    indexValue,
    leftValue,
    widthValue,
  }: {
    indexValue: Animated.Value;
    leftValue: Animated.Value;
    widthValue: Animated.Value;
  }) => React.ReactNode;
  renderTabBarLeftSection?: () => React.ReactNode;
  renderTabBarRightSection?: () => React.ReactNode;
  tabBarIndicatorMode?: 'tab' | 'label';
  tabBarIndicatorWidthRatio?: number;
  tabBarMode?: 'scrollable' | 'fixed';

  onIndexChange?: (index: number) => void;
  renderScene: ({ route, index, jumpTo }: SceneProps) => React.ReactNode;
  lazy?: boolean;
  // lazyPreloadDistance?: number;
  sceneContainerStyle?: StyleProp<ViewStyle>;
  renderLazyPlaceholder?: () => React.ReactNode;
  keyboardDismissMode?: 'on-drag' | 'none';
  swipeEnabled?: boolean;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  onPagerScroll?: (position: number, offset: number) => void;
  initialIndex?: number;
}

class TabView extends React.PureComponent<TabViewProps> {
  tabBarRef: React.RefObject<TabBar> = React.createRef<TabBar>();
  viewPagerRef: React.RefObject<ViewPager> = React.createRef<ViewPager>();

  static defaultProps = {
    tabBarPosition: 'top',
    scrollEnabled: true,
    bounces: true,
    lazy: true,
    swipeEnabled: true,
    initialIndex: 0,
  };

  public jumpTo(position: number): void {
    this.tabBarRef.current && this.tabBarRef.current.scrollToIndex(position);
    this.viewPagerRef.current && this.viewPagerRef.current.scrollToIndex(position);
  }

  render() {
    const {
      style,
      renderTabBar,
      tabBarPosition,

      tabBarStyle,
      tabBarContentContainerStyle,
      tabBarTabStyle,
      tabBarLabelStyle,
      tabBarIndicatorStyle,
      tabBarActiveColor,
      tabBarInactiveColor,
      scrollEnabled,
      bounces,
      onTabBarPress,
      renderTabBarLabel,
      renderTabBarIcon,
      renderTabBarBadge,
      renderTabBarIndicator,
      renderTabBarLeftSection,
      renderTabBarRightSection,
      tabBarIndicatorMode,
      tabBarIndicatorWidthRatio,
      tabBarMode,

      navigationState,
      onIndexChange,
      renderScene,
      lazy,
      // lazyPreloadDistance,
      sceneContainerStyle,
      renderLazyPlaceholder,
      keyboardDismissMode,
      swipeEnabled,
      onSwipeStart,
      onSwipeEnd,
      onPagerScroll,
      initialIndex,
    } = this.props;
    const renderTabBarComponent = () => {
      if (renderTabBar) {
        return renderTabBar({
          ref: this.tabBarRef,
          routes: navigationState,
          onTabChange: (index: number) => {
            this.viewPagerRef.current && this.viewPagerRef.current.scrollToIndex(index);
          },
          initialIndex,
        });
      } else {
        return (
          <TabBar
            ref={this.tabBarRef}
            routes={navigationState}
            style={tabBarStyle}
            contentContainerStyle={tabBarContentContainerStyle}
            tabStyle={tabBarTabStyle}
            labelStyle={tabBarLabelStyle}
            renderLabel={renderTabBarLabel}
            renderIndicator={renderTabBarIndicator}
            activeColor={tabBarActiveColor}
            inactiveColor={tabBarInactiveColor}
            indicatorStyle={tabBarIndicatorStyle}
            renderIcon={renderTabBarIcon}
            renderBadge={renderTabBarBadge}
            onTabPress={(index) => {
              onTabBarPress && onTabBarPress(index);
            }}
            onTabChange={(index) => {
              this.viewPagerRef.current && this.viewPagerRef.current.scrollToIndex(index);
            }}
            initialIndex={initialIndex}
            scrollEnabled={scrollEnabled}
            bounces={bounces}
            renderLeftSection={renderTabBarLeftSection}
            renderRightSection={renderTabBarRightSection}
            indicatorMode={tabBarIndicatorMode}
            indicatorWidthRatio={tabBarIndicatorWidthRatio}
            tabMode={tabBarMode}
          />
        );
      }
    };

    return (
      <View style={[styles.container, style]}>
        {tabBarPosition === 'top' && renderTabBarComponent()}
        <ViewPager
          ref={this.viewPagerRef}
          routes={navigationState}
          sceneContainerStyle={sceneContainerStyle}
          initialIndex={initialIndex}
          lazy={lazy}
          // lazyPreloadDistance={lazyPreloadDistance}
          renderLazyPlaceholder={renderLazyPlaceholder}
          onIndexChange={(index, callback) => {
            this.tabBarRef.current && this.tabBarRef.current.scrollToIndex(index, callback);
            onIndexChange && onIndexChange(index);
          }}
          renderScene={renderScene}
          keyboardDismissMode={keyboardDismissMode}
          swipeEnabled={swipeEnabled}
          onSwipeStart={onSwipeStart}
          onSwipeEnd={onSwipeEnd}
          onPagerScroll={onPagerScroll}
        />
        {tabBarPosition === 'bottom' && renderTabBarComponent()}
      </View>
    );
  }
}

export default TabView;
