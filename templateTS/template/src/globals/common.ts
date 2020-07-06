/// 为什么不将common.tsx中代码放至在basics.tsx？
/// common.tsx导入的包引用了basics.tsx中，分两次先后导入能解决

import ThemeManager, { ThemeInstance, themes } from '../resources/themes';
import LangManager, { locales } from '../resources/locales';

ThemeManager.register(themes.customize, 'customize'); // 初始化主题
LangManager.register(locales['zh-Hans'], 'zh-Hans'); // 初始化语言，默认简体中文

global.Theme = ThemeManager;
global.Styles = ThemeInstance.styles;
global.Colors = ThemeInstance.colors;
global.Dimens = ThemeInstance.dimens;
global.Lang = LangManager;
