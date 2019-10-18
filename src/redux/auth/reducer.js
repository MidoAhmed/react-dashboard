import {Map} from 'immutable';
import {getToken} from '../../helpers/utility';
import actions from './actions';

const initState = new Map({
    idToken: null,
    loading: false,
    loginFailed: null
});

export default function authReducer(state = initState.merge(getToken()), action) {
    switch (action.type) {
        case actions.LOGIN_REQUEST:
            return state.set('loading', true).set('loginFailed', null);
        case actions.LOGIN_SUCCESS:
            return state.set('idToken', action.token).set('loading', false);
        case actions.LOGIN_ERROR:
            return state.set('loading', false).set('loginFailed', action.loginFailed);
        case actions.LOGOUT:
            return initState;
        default:
            return state;
    }
}
