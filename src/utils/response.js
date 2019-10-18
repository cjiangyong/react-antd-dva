import { notification } from 'antd';

export function checkResponse(response) {
  const rspHead = response.RSP_HEAD;
  if (rspHead) {
    if (rspHead.TRAN_SUCCESS === false) {
      notification.error({ message: rspHead.ERROR_MESSAGE });
      return false;
    }
    return true;
  }
  return false;
}
