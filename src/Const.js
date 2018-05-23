
import { Platform, Dimensions, PixelRatio } from 'react-native'

const { width, height } = Dimensions.get('window');

/**
 * 将size转换成375下的值，屏幕适配
 * @param {*} size 
 */
export const getSize = (size) => {
  //当size <= 1，一般用于边框或者分割线，避免不足一个像素的情况。
  if (size <= 1 && size > 0) {
    return (PixelRatio.get() == 3 ? 2 : 1) / PixelRatio.get()
  } else {
    return parseInt(width * size / 375);
  }
}

export const __IOS__ = (Platform.OS === 'ios' ? true : false);

export const __ANDROID__ = (Platform.OS === 'android' ? true : false);

export default class Const {

  static SCREEN_WIDTH = parseInt(width); //屏幕宽度

  static SCREEN_HEIGHT = parseInt(height); //屏幕高度
}