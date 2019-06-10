import config from '../config';

export default class AppServices {

    constructor() {
        this.base_url = config.apiUrl;
    }

    /**
     * Service function to avoid repetition of fetch everywhere
     * @param {string} url - url to fetch
     * @param {string} method - method get or post
     * @param {string|boolean} token  - authentication token
     * @param {object|null} params - params payload
     */
    async apiCall(url, method = 'GET', token = false, params = null){
        console.log(`${this.base_url}${url}`);

        let payload = {
            method,
            mode: 'cors',
            headers: this.buildHeaders(token),
        }

        if (params) {
            payload.body = JSON.stringify(params);
        }

        /*const res = await fetch(`${this.base_url}${url}`, payload);
        const status = res.status;
        const body = await res.json();*/

        // return { status, body };
        // return new Promise(resolve => resolve(res))
        return await fetch(`${this.base_url}${url}`, payload);
    }

    /**
     * Build  http headers object
     * @param {string|boolean} token
     */
    buildHeaders(token = false) {
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        if (token) {
            headers.append('Authorization', `Token ${token}`);
        }

        return headers;
    }

    /**
     * Throw common error on not successful status
     * @param {object} response
     * @param {bool} auth - check for unauth error or not
     */
    handleCommonError(response, auth = false) {
        console.log(response);
        if(response.status === 401 && auth) {
            /*
            StorageService.removeToken()
            window.location(api.login)
            */
        }
        if (response.status !== 200 && response.status !== 201) {
            throw new Error(response.body.message)
        }
        return;
    }

}

