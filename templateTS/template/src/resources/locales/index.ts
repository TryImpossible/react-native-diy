import en from './en';
import zhHans from './zh-Hans';

// Lang标识类型
export type Lang = 'en' | 'zh-Hans';

// Lang数据类型
export type LangData = typeof en;

// Locales类型
interface Locales {
  en: LangData;
  'zh-Hans': LangData;
}

// 所有的语言
const locales: Locales = {
  en, // 英文
  'zh-Hans': zhHans, // 简体中文,
  // 'en-US': en,
  // 'en-CN': en,
  // 'zh-CN': zhHans,
  // 'zh-HK': zhHant,
  // 'zh-TW': zhHant,
  // 'zh-Hans-CN': zhHans, // 大陆地区使用的简体中文
  // 'zh-Hans-HK': zhHans, // 香港地区使用的简体中文
  // 'zh-Hans-MO': zhHans, // 澳门使用的简体中文
  // 'zh-Hans-SG': zhHans, // 新加坡使用的简体中文
  // 'zh-Hans-TW': zhHans, // 台湾使用的简体中文
  // 'zh-Hant': zhHant, // 繁体中文
  // 'zh-Hant-CN': zhHant, // 大陆地区使用的繁体中文
  // 'zh-Hant-HK': zhHant, // 香港地区使用的繁体中文
  // 'zh-Hant-MO': zhHant, // 澳门使用的繁体中文
  // 'zh-Hant-SG': zhHant, // 新加坡使用的繁体中文
  // 'zh-Hant-TW': zhHant // 台湾使用的繁体中文
};

// 当前的语言
const Locale = {
  lang: 'en',
  ...locales.en,
};

// Lang管理类
const LangManager = {
  lang: Locale.lang,
  register(langData: LangData, lang: Lang) {
    Object.assign(Locale, langData, { lang });
  },
  get(key: string): string {
    let message = key.split(/\./).reduce((last: any, current) => last && last[current], Locale);
    if (!message) {
      message = `Missing ${this.lang}.${key}`;
    }
    return message;
  },
};

export { LangManager as default, locales };

// LocaleContext
// LocaleProvider
