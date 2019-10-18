import { queryCurrent, queryUser, removeUser, checkUserName, addUser, updateUser } from '../services/user';
import { checkResponse } from '../utils/response';

export default {
  namespace: 'user',
  state: {
    currentUser: {},
    page: {},
    data: [],
    exist: true,
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryUser, payload);
      if (checkResponse(response)) {
        yield put({
          type: 'save',
          payload: response.RSP_BODY,
        });
      }
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeUser, payload);
      checkResponse(response);
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addUser, payload);
      checkResponse(response);
      if (callback) callback();
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateUser, payload);
      checkResponse(response);
      if (callback) callback();
    },
    *check({ payload }, { call, put }) {
      const response = yield call(checkUserName, payload);
      if (checkResponse(response)) {
        yield put({
          type: 'checkIfExist',
          payload: response.RSP_BODY,
        });
      }
    },
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload[0],
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload.elements,
        page: action.payload.page,
      };
    },
    checkIfExist(state, action) {
      return {
        ...state,
        exist: action.payload.elements,
      };
    },
  },
};
