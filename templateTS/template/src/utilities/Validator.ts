export const getType = (v: any): string => Object.prototype.toString.call(v);

export const isString = (v: any): boolean => getType(v) === '[object String]';

export const isNumber = (v: any): boolean => getType(v) === '[object Number]';

export const isBoolean = (v: any): boolean => getType(v) === '[object Boolean]';

export const isUndefined = (v: any): boolean => getType(v) === '[object Undefined]';

export const isNull = (v: any): boolean => getType(v) === '[object Null]';

export const isObject = (v: any): boolean => getType(v) === '[object Object]';

export const isArray = (v: any): boolean => getType(v) === '[object Array]';

export const isError = (v: any): boolean => getType(v) === '[object Error]';

export const isFunction = (v: any): boolean => getType(v) === '[object Function]';

const phoneRegularExp = {
  // '86': /^(\\+?0?86\\-?)?1[345789]\\d{9}$/, // 中国大陆
  '86': /^1[3|4|5|6|7|8]\d{9}$/, // 中国大陆
  '91': /^(\+?91|0)?[789]\d{9}$/, // 印度
};
export const isValidPhoneNumber = (phone: string, areacode: '86' | '91' = '86'): boolean => {
  if (typeof phone === 'string') {
    return phoneRegularExp[areacode].test(phone);
  }
  return false;
};

export const isValidEmailAddress = (email: string | undefined | null): boolean => {
  if (typeof email === 'string') {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
  }
  return false;
};

export const isValidVerifyCode = (code: string | null | undefined): boolean => {
  if (typeof code === 'string') {
    return code.length === 6;
  }
  return false;
};

export const isValidPassword = (password: string | null | undefined): boolean => {
  if (typeof password === 'string') {
    return /^[0-9a-zA-Z]{6,16}$/g.test(password);
  }
  return false;
};

// export const isValidNickname = name => /^[0-9a-zA-Z|_]{0,20}$/g.test(name);
export const isValidNickname = (nickName: string | null | undefined): boolean => {
  if (typeof nickName === 'string') {
    return nickName.length > 0 && nickName.length <= 20;
  }
  return false;
};

export const isValidSignature = (signature: string | null | undefined): boolean => {
  if (isString(signature)) {
    return (signature as string).length > 0 && (<string>signature).length <= 40;
  }
  return false;
};

export const isEmpty = (data: any): boolean => {
  if (isNull(data)) {
    return true;
  }
  if (isUndefined(data)) {
    return true;
  }
  if (isString(data)) {
    return data.replace(/\s+/g, '').length === 0;
  }
  if (isArray(data)) {
    return data.length === 0;
  }
  if (isObject(data)) {
    return Object.keys(data).length === 0 || JSON.stringify(data) === '{}';
  }
  return false;
};
