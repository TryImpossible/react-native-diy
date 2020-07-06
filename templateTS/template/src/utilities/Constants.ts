import { Dimensions, Platform, StatusBar, StyleSheet, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

export const IS_IOS: boolean = Platform.OS === 'ios';
export const IS_ANDROID: boolean = Platform.OS === 'android';
export const IOS_IS_IPHONE_X: boolean = !!(IS_IOS && !Platform.isTV && height >= 812 && width >= 375);
export const IS_WEB = Platform.OS === 'web';

export const SCREEN_WIDTH: number = width;
export const SCREEN_HEIGHT: number = height;
export const STATUSBAR_HEIGHT: number = IS_ANDROID ? StatusBar.currentHeight || 24 : IOS_IS_IPHONE_X ? 44 : 20;
export const NAVBAR_HEIGHT: number = 44;
export const TABBAR_HEIGHT: number = 49;
export const SAFE_BOTTOM_HEIGHT: number = IOS_IS_IPHONE_X ? 34 : 0;
export const ONE_PX: number = (PixelRatio.get() === 3 ? 2 : 1) / PixelRatio.get();
export const DIVIDER_HEIGHT: number = StyleSheet.hairlineWidth;

export const PRIMARY_COLOR = '#FFFFFF';
