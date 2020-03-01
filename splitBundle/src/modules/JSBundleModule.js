import {NativeModules} from 'react-native';

const {JSBundleModule} = NativeModules;

class JSBundle {
  // asset方式
  static ASSET = JSBundleModule.ASSET;
  // file方式
  static FILE = JSBundleModule.FILE;
  // network方式
  static NETWORK = JSBundleModule.NETWORK;

  /**
   * 加载JSBundle
   * @param {*} bundleType 加载方式
   * @param {*} bundleName 名称
   */
  static load(bundleType, bundleName) {
    JSBundleModule.load(bundleType, bundleName);
  }
}

export default JSBundle;
