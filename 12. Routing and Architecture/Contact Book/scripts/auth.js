let auth = (() => {
    function saveSession(data) {
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('id', data._id);
        sessionStorage.setItem('authToken', data._kmd.authtoken);
    }

    async function login(username, password) {
        let userData = {username, password};
        try {
            let data = await remote.post('user', 'login', userData, 'basic');
            saveSession(data);
            return true;
        } catch (e) {
            return e;
        }
    }

    async function register(username, password) {
        let userData = {username, password};
        try {
            let data = await remote.post('user', '', userData, 'basic');
            saveSession(data);
            return true;
        } catch (e) {
            return e;
        }
    }

    async function logout() {
        try {
            await remote.post('user', '_logout');
            sessionStorage.clear();
            return true;
        } catch (e) {
            return e;
        }
    }

    return {login, register, logout}
})();