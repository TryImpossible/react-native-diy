import _ from 'lodash';
import ThemeManager, { Styles, Colors, Dimens } from '../resources/themes';
import LangManager from '../resources/locales';

type LODASH = typeof _;
type THEME = typeof ThemeManager;
type LANG = typeof LangManager;

declare global {
  interface Window {
    __DEV__: boolean | false;
  }

  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly PUBLIC_URL: string;
    }
    interface Global {
      _: LODASH;
      __ANDROID__: boolean;
      __IOS__: boolean;
      __IPHONEX__: boolean;
      __WEB__: boolean;
      __WIDTH__: number;
      __HEIGHT__: number;
      __ONEPX__: number;
      toDP: (size: number, enableHeightAdapt?: boolean) => number;
      toSP: (size: number) => number;
      color: () => string;
      Theme: THEME;
      Styles: Styles;
      Colors: Colors;
      Dimens: Dimens;
      Lang: LANG;
      user: { [name: string]: any };
    }
  }
  const _: LODASH;
  const __ANDROID__: boolean;
  const __IOS__: boolean;
  const __IPHONEX__: boolean;
  const __WEB__: boolean;
  const __WIDTH__: number;
  const __HEIGHT__: number;
  const __ONEPX__: number;
  const toDP: (size: number, enableHeightAdapt?: boolean) => number;
  const toSP: (size: number) => number;
  const color: () => string;
  const Theme: THEME;
  const Styles: Styles;
  const Colors: Colors;
  const Dimens: Dimens;
  const Lang: LANG;
}
