import fetch from 'dva/fetch';
import moment from 'moment';
import { notification } from 'antd';
import Config from '../common/config';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.code = response.status;
  error.message = response.statusText;
  throw error;
}


/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(sUrl, data) {
  const url = Config.api + sUrl;
  const requestHeader = {
    reqTme: moment().format('YYYY-MM-DDTh:mm:ss'),
    userInfo: {
      name: 'zzm',
    },
    token: 'devToken',
  };
  const packet = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'appliaction/json,text/plain,*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      token: 'sessionId',
    },
    credentials: 'include',
    body: `REQ_MESSAGE=${encodeURIComponent(JSON.stringify({ REQ_HEAD: requestHeader, REQ_BODY: { ...data } }))}`,
  };


  return fetch(url, packet)
    .then(checkStatus)
    .then(response => response.json())
    .catch((error) => {
      if ('stack' in error || 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.code || error.message,
        });
      }
      return error;
    });
}
