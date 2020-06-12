import {StatusBar, Dimensions, Platform} from 'react-native';
const {width, height} = Dimensions.get('window');

export const IS_IOS: boolean = Platform.OS === 'ios';
export const IS_ANDROID: boolean = Platform.OS === 'android';
export const IOS_IS_IPHONE_X: boolean = !!(
  IS_IOS &&
  !Platform.isTV &&
  height >= 812 &&
  width >= 375
);
export const IS_WEB = Platform.OS === 'web';

export const statusBarHeight = IS_WEB
  ? 0
  : IS_ANDROID
  ? StatusBar.currentHeight || 24
  : IOS_IS_IPHONE_X
  ? 44
  : 20;

export const _color = () => {
  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  if (color.length !== 7) {
    return _color();
  }
  return color;
};
