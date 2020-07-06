import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const FONT_SCALE_RATIO: number = PixelRatio.getFontScale();

// / UI设计稿基于iphone 6
const UI_DESIGN_WIDTH: number = 375; // UI设计稿宽度，逻辑像素
const UI_DESIGN_HEIGHT: number = 667; // UI设计稿高度，逻辑像素
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UI_ASPECT_RATIO: number = 375 / 667; // UI设计稿高宽比，iphone 6高宽比为16：9

const WIDTH_SCALE_RATIO: number = width / UI_DESIGN_WIDTH; // 宽缩放比
const HEIGHT_SCALE_RATIO: number = height / UI_DESIGN_HEIGHT; // 高缩放比

// / 屏幕尺寸适配方法
export const toDP = (size: number, enableHeightAdapt?: boolean): number => {
  return size * (enableHeightAdapt ? HEIGHT_SCALE_RATIO : WIDTH_SCALE_RATIO);
};

// / 屏幕字号适配方法
export const toSP = (size: number): number => {
  return size * WIDTH_SCALE_RATIO * FONT_SCALE_RATIO;
};
