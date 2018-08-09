const appController = {};

function startApp() {
    Sammy('#app', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html',appController.displayHome);
        this.get('#/home', appController.displayHome);
        this.get('#', appController.displayHome);

        this.get('#/login', appController.displayLogin);
        this.post('#/login', appController.login);

        this.get('#/register', appController.displayRegister);
        this.post('#/register', appController.register);

        this.get('#/logout', function () {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    notifications.showInfo('Logout successful.');
                    this.redirect('#/home');
                }).catch(notifications.handleAjaxError);
        });

        this.get('#/messages', appController.displayMessages);

        this.get('#/archive', appController.displayArchive);

        this.get('#/send', appController.displaySendMessages);
        this.post('#/send', appController.sendMessages);
    }).run()
}