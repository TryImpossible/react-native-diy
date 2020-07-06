import { StatusBar } from 'react-native';

export const textTitleSize = 18;
export const textBigSize = 18;
export const textNormalSize = 15;
export const textSmallSize = 12;
export const textSmallMiniSize = 11;

export const statusBarHeight = __ANDROID__ ? StatusBar.currentHeight || 24 : __IPHONEX__ ? 44 : 20;
export const navBarHeight = 44;
export const tabBarHeight = 45;
export const bottomTabBarHeight = 49;
export const safeBottomHeight = __IPHONEX__ ? 34 : 0;
export const onePX = __ONEPX__;
export const dividerHeight = __ONEPX__;

export const activeOpacity = 0.6;
