let remote = (() => {
    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_ry-56q2EQ';
    const appSecret = '598fc4cb189a4cebb838f6801e635466';

    function makeAuth(type) {
        if (type === 'basic') return 'Basic ' + btoa(appKey + ':' + appSecret);
        else return 'Kinvey ' + sessionStorage.getItem('authToken');
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

    function remove(module, urlExt, auth) {
        return $.ajax(makeRequest('DELETE', module, urlExt, auth));
    }

    return {get, post, update, remove};
})();