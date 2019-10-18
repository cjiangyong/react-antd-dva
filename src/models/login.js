import { routerRedux } from 'dva/router';
import { signIn, signOut } from '../services/api';
import { checkResponse } from '../utils/response';

export default {
  namespace: 'login',

  state: {
    status: 'no',
    info: {},
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(signIn, payload);
      if (checkResponse(response)) {
        yield put({
          type: 'changeLoginStatus',
          payload: response.RSP_BODY,
        });
      }
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *logout(_, { call, put }) {
      const response = yield call(signOut);
      if (response) {
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: 'ok',
        info: payload.userInfo,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        status: payload,
        submitting: payload,
      };
    },
  },
};
