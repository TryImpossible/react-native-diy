import { AxiosResponse } from 'axios';
import { CustomAxiosRequestConfig } from './typings';
// import { Loader } from 'components/common';

function show(req: CustomAxiosRequestConfig) {
  const { showLoader } = req;
  // showLoader && Loader.show();
}

function dismiss(res: AxiosResponse) {
  const { config } = res;
  const { showLoader } = config as CustomAxiosRequestConfig;
  // showLoader && Loader.dismiss();
  Object.assign(config, { showLoader: false });
}

export default {
  show,
  dismiss,
};
