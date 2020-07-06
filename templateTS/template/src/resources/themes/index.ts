import customize from './customize';

// Theme类型
export type Theme = 'customize' | string;

// Themeo数据类型
export type ThemeData = typeof customize;

// Style类型
export type Styles = typeof customize.styles;

// Color类型
export type Colors = typeof customize.colors;

// Dimen类型
export type Dimens = typeof customize.dimens;

// Themes类型
export interface Themes {
  customize: ThemeData;
  [name: string]: ThemeData;
}

// 所有的主题
const themes: Themes = {
  customize,
};

// 当前的主题
const ThemeInstance = {
  theme: 'customize',
  ...themes.customize,
};

// 主题管理类
const ThemeManager = {
  theme: ThemeInstance.theme,
  register(themeData: ThemeData, theme: Theme) {
    Object.assign(ThemeInstance, themeData, { theme });
  },
};

export { ThemeManager as default, ThemeInstance, themes };
