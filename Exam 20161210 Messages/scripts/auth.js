let auth = (() => {
    function isAuthed() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function saveSession(userInfo) {
        sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('fullName', userInfo.name);
    }

    // user/login
    function login(username, password) {
        return sendRequest.post('user', 'login', {username, password}, 'basic');
    }

    // user/register
    function register(username, password, name) {
        return sendRequest.post('user', '', {username, password, name}, 'basic');
    }

    // user/logout
    function logout() {
        return sendRequest.post('user', '_logout', { authtoken: sessionStorage.getItem('authtoken')});
    }

    return {login, register, logout, saveSession, isAuthed}
})();