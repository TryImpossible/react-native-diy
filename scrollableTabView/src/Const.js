
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

/**
 * 獲取随机颜色，一般调试使用 
 */
export const getRandomColor = () => {
  //颜色字符串  
  var colorStr = "#";
  //字符串的每一字符的范围  
  var randomArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  //产生一个六位的字符串  
  for (var i = 0; i < 6; i++) {
    //15是范围上限，0是范围下限，两个函数保证产生出来的随机数是整数  
    colorStr += randomArr[Math.ceil(Math.random() * (15 - 0) + 0)];
  }
  return colorStr;
}