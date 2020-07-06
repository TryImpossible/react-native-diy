import { Image } from 'react-native';
import { isObject, isArray, isString } from './Validator';

export default function prefetchImage(data: any) {
  if (isString(data) && data.startsWith('http')) {
    if (data.includes('.png') || data.includes('.jpg') || data.includes('.JPG') || data.includes('.jpeg')) {
      Image.prefetch(data.replace(/(\?[\S\s]+)?/g, ''));
    }
  } else if (isObject(data)) {
    Object.keys(data).forEach(key => prefetchImage(data[key]));
  } else if (isArray(data)) {
    data.forEach((item: any) => prefetchImage(item));
  }
}
