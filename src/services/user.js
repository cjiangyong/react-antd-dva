import { stringify } from 'qs';
import request from '../utils/request';

export async function queryCurrent(params) {
  return request(`/user/getUser?${stringify(params)}`);
}

export async function queryUser(params) {
  return request('/user/getUser.json', params);
}

export async function removeUser(params) {
  return request('/user/removeUser.json', params);
}

export async function addUser(params) {
  return request('/user/addUser.json', params);
}

export async function updateUser(params) {
  return request('/user/updateUser.json', params);
}

export async function checkUserName(params) {
  return request('/user/checkUserName.json', params);
}
