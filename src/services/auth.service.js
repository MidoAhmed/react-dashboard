import AppServices from "./app.service";

class Auth extends AppServices {

    constructor(){
        super();
        this.getAuthenticated = this.getAuthenticated.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    signIn(payload) {
        return this.apiCall('auth/signin', 'POST', false, payload);
    }

    getAuthenticated() {
        return this.apiCall('auth/authenticated', 'GET');
        /*return new Promise(resolve => {
            setTimeout(() => resolve([]), 2000)
        })*/
    }

    logout() {
        return this.apiCall('auth/logout', 'GET');
    }
};

const auth = new Auth();
export default auth;