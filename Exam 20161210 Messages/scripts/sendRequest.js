let sendRequest = (() => {
    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_S1sAJmdrX';
    const appSecret = '3999c5d4a59b4b8aa11757d20d113118';

    function makeAuth(type) {
        if (type === 'basic') return 'Basic ' + btoa(appKey + ':' + appSecret);
        else return 'Kinvey ' + sessionStorage.getItem('authtoken');
    }

    function makeRequest(method, module, urlExt, auth) {
        return {
            url: baseUrl + module + '/' + appKey + '/' + urlExt,
            method: method,
            headers: {Authorization: makeAuth(auth)}
        };
    }

    function get(module, urlExt, auth) {
        return $.ajax(makeRequest('GET', module, urlExt, auth));
    }

    function post(module, urlExt, data, auth) {
        let req = makeRequest('POST', module, urlExt, auth);
        req.data = JSON.stringify(data);
        req.contentType = "application/json";
        return $.ajax(req);
    }

    function update(module, urlExt, data, auth) {
        let req = makeRequest('PUT', module, urlExt, auth);
        req.data = JSON.stringify(data);
        req.contentType = "application/json";
        return $.ajax(req);
    }

    function del(module, urlExt, auth) {
        return $.ajax(makeRequest('DELETE', module, urlExt, auth));
    }

    return {get, post, update, del};
})();