import {all, call, takeEvery, put, fork} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {clearToken} from '../../helpers/utility';
import actions from './actions';
import auth from '../../services/auth.service'

const fakeApiCall = false; // auth0 or express JWT

export function* loginRequest() {
    yield takeEvery(actions.LOGIN_REQUEST, function* (payload) {
        try {
            const credentials = payload.payload;
            const result = yield call(auth.signIn, credentials);
            const status = result.status;
            const body = yield result.json();
            auth.handleCommonError({status, body});
            if (body && body.user)
                yield put({
                    type: actions.LOGIN_SUCCESS,
                    token: body.user.token,
                    profile: body.user
                });
        } catch (error) {
            console.error(error);
            yield put({
                type: actions.LOGIN_ERROR,
                loginFailed: error.message
            });
        }

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
