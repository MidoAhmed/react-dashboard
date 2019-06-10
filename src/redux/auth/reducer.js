import {Map} from 'immutable';
import {getToken} from '../../helpers/utility';
import actions from './actions';

const initState = new Map({
    idToken: null,
    loading: false
});

export default function authReducer(state = initState.merge(getToken()), action) {
    switch (action.type) {
        case actions.LOGIN_REQUEST:
            console.log('loading', action);
            return state.set('loading', true);
        case actions.LOGIN_SUCCESS:
            return state.set('idToken', action.token).set('loading', false);
        case actions.LOGOUT:
            return initState;
        default:
            return state;
    }
}
