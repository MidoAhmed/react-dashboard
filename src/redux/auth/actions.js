const authActons = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGOUT: 'LOGOUT',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_ERROR: 'LOGIN_ERROR',
    login: (credentials) => ({
        type: authActons.LOGIN_REQUEST,
        payload: credentials
    }),
    logout: () => ({
        type: authActons.LOGOUT,
    }),
};
export default authActons;
