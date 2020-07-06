import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import DateUtils from '../../utilities/DateUtils';

// type Content = [string, any, string?];

// type Print = (groupTitle: string, groupContent: Content, groupColor?: 'green' | 'red') => void;

// const print: Print = (groupTitle, groupContent: any, groupColor = 'green') => {
//   console.group && console.group(`%c${groupTitle}`, `color: ${groupColor}`);
//   groupContent.forEach((element: Content) => {
//     if (element) {
//       const [title, content, color = 'green'] = element;
//       console.info && console.info(`%c${title}`, `color: ${color}`, '\n', content);
//     }
//   });
//   console.groupEnd && console.groupEnd();
// };

type PrintLog = (title?: string, content?: any, color?: 'green' | 'red') => void;

const printLog: PrintLog = (title, content, color = 'green') => {
  console.group && console.group(`%c${title}`, `color: ${color}`);
  console.info && console.info(content);
  console.groupEnd && console.groupEnd();
};

function request(req: AxiosRequestConfig) {
  // console.log('req', req);
  const { baseURL, url, method } = req;
  const prefixStr = '[Axios Request]';
  const timeStr = DateUtils.formateLogTime(new Date().toUTCString());
  const methodStr = method?.toUpperCase();
  const urlStr = baseURL ? baseURL + url : url;
  const title = `${prefixStr} [${timeStr}] ${methodStr} ${urlStr}`;
  const content = req;
  printLog(title, content);
}

function response(res: AxiosResponse) {
  // console.log('res', res);
  const {
    config: { baseURL, url, method },
  } = res;
  const prefixStr = '[Axios Response]';
  const timeStr = DateUtils.formateLogTime(new Date().toUTCString());
  const methodStr = method?.toUpperCase();
  const urlStr = baseURL ? baseURL + url : url;
  const title = `${prefixStr} [${timeStr}] ${methodStr} ${urlStr}`;
  const content = res;
  printLog(title, content);
}

function error(err: AxiosError) {
  // console.log('err', err);
  printLog('[Axios Error]', err);
}

export default {
  request,
  response,
  error,
};
