import {all, call, takeEvery, put, fork} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {clearToken} from '../../helpers/utility';
import actions from './actions';
import auth from '../../services/auth.service'

const fakeApiCall = false; // auth0 or express JWT

export function* loginRequest() {
    yield takeEvery(actions.LOGIN_REQUEST, function* () {
        const payload = {
            email: "lorem",
            password: "password"
        };
        const res = yield call(auth.signIn, payload)
        const body = yield res.json();
        yield put({
            type: actions.LOGIN_SUCCESS,
            token: body.user.token,
            profile: body.user
        });

        /*if (fakeApiCall) {
          yield put({
            type: actions.LOGIN_SUCCESS,
            token: 'secret token',
            // profile: 'Profile'
          });
        } else {
          yield put({ type: actions.LOGIN_ERROR });
        }*/
    });
}

export function* loginSuccess() {
    yield takeEvery(actions.LOGIN_SUCCESS, function* (payload) {
        yield localStorage.setItem('id_token', payload.token);
        yield put(push('/dashboard'));
    });
}

export function* loginError() {
    yield takeEvery(actions.LOGIN_ERROR, function* () {
    });
}

export function* logout() {
    yield takeEvery(actions.LOGOUT, function* () {
        clearToken();
        yield put(push('/'));
    });
}

export default function* rootSaga() {
    yield all([
        fork(loginRequest),
        fork(loginSuccess),
        fork(loginError),
        fork(logout)
    ]);
}
