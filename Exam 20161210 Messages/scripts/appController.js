function getPartials(section) {
    return {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        section: `./templates/sections/${section}.hbs`
    }
}

function getUser(ctx) { ctx.user = sessionStorage.getItem('username')}

function formatDate(dateISO8601) {
    let date = new Date(dateISO8601);
    if (Number.isNaN(date.getDate()))
        return '';
    return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
        "." + date.getFullYear() + ' ' + date.getHours() + ':' +
        padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

    function padZeros(num) {
        return ('0' + num).slice(-2);
    }
}

function deleteMessage() {
    let messageId = $(this).attr('data-message-id');
    sendRequest.del('appdata', 'messages/' + messageId)
        .then(() => {
            notifications.showInfo('Message deleted.');
            $(this).parent().parent().remove();
        }).catch(notifications.handleAjaxError);
}

appController.displayHome =  function () {
    getUser(this);
    this.loadPartials(getPartials('viewUserHome'))
        .then(function () { this.partial('./templates/common/main.hbs')});
};

appController.displayLogin = function () {
    this.loadPartials(getPartials('viewLogin'))
        .then(function () {this.partial('./templates/common/main.hbs')});
};

appController.login = function () {
    let {username, password} = this.params;

    if (!username)
        notifications.showError('Username can not be empty!');
    else if (!password)
        notifications.showError('Password can not be empty!');
    else
        auth.login(username, password)
            .then( userData => {
                auth.saveSession(userData);
                notifications.showInfo('Login successful.');
                this.redirect('#/home');
            }).catch(notifications.handleAjaxError);
};

appController.displayRegister = function () {
    this.loadPartials(getPartials('viewRegister'))
        .then(function () {this.partial('./templates/common/main.hbs')});
};

appController.register = function () {
    let {username, password, name } = this.params;

    if (!username)
        notifications.showError('Username can not be empty!');
    else if (!password)
        notifications.showError('Password can not be empty!');
    else
        auth.register(username, password, name)
            .then( userData => {
                auth.saveSession(userData);
                notifications.showInfo('User registration successful.');
                this.redirect('#/home');
            }).catch(notifications.handleAjaxError);
};

appController.displayMessages = function () {
    getUser(this);
    sendRequest.get('appdata', `messages?query={"recipient_username":"${this.user}"}`)
        .then((messages) => {
            messages.forEach(m => m.dateTime = formatDate(m._kmd.lmt));
            this.messages = messages;
            this.loadPartials(getPartials('viewMyMessages'))
                .then(function () { this.partial('./templates/common/main.hbs')});
        }).catch(notifications.handleAjaxError);
};

appController.displaySendMessages = function () {
    getUser(this);
    sendRequest.get('user', '')
        .then(users => {
            this.users = users;
            this.loadPartials(getPartials('viewSendMessage'))
                .then(function () {this.partial('./templates/common/main.hbs')});
        }).catch(notifications.handleAjaxError);
};

appController.sendMessages = function () {
    let {recipient, text} = this.params;
    let messageData = {
        sender_username:sessionStorage.getItem('username'),
        sender_name:sessionStorage.getItem('fullName'),
        recipient_username:recipient,
        text:text
    };

    sendRequest.post('appdata', 'messages', messageData)
        .then(() => {
            notifications.showInfo('Message sent.');
            this.redirect('#/archive');
        }).catch(notifications.handleAjaxError);
};

appController.displayArchive = function () {
    getUser(this);
    sendRequest.get('appdata', `messages?query={"sender_username":"${this.user}"}`)
        .then(messages => {
            messages.forEach(m => m.dateTime = formatDate(m._kmd.lmt));
            this.messages = messages;
            this.loadPartials(getPartials('viewArchiveSend'))
                .then(function () {
                    this.partial('./templates/common/main.hbs')
                        .then(() => $('button').click(deleteMessage)) // e => e.target
                });
        }).catch(notifications.handleAjaxError);
};