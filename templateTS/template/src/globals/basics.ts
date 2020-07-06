import lodash from 'lodash';
import { toDP, toSP } from '../utilities/ScreenAdapter';
import {
  IS_ANDROID,
  IS_IOS,
  IOS_IS_IPHONE_X,
  IS_WEB,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  ONE_PX,
} from '../utilities/Constants';

global._ = lodash;
global.toDP = toDP;
global.toSP = toSP;
global.__ANDROID__ = IS_ANDROID;
global.__IOS__ = IS_IOS;
global.__IPHONEX__ = IOS_IS_IPHONE_X;
global.__WEB__ = IS_WEB;
global.__WIDTH__ = SCREEN_WIDTH;
global.__HEIGHT__ = SCREEN_HEIGHT;
global.__ONEPX__ = ONE_PX;
global.color = () => {
  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  if (color.length !== 7) {
    return global.color();
  }
  return color;
};

if (!__DEV__) {
  global.console = {
    ...global.console,
    info: () => {},
    log: () => {},
    group: () => {},
    groupEnd: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {},
  };
}
