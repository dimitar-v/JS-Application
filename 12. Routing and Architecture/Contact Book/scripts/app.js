const handlers = {};

$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbr');

        this.get('index.html', displayWelcome);

        //this.get('', displayWelcome);
        
        function displayWelcome() {
            console.log('Display welcome form');
            this.loadPartials({
                header: './templates/common/header.hbr',
                footer: './templates/common/footer.hbr'
            }).then(function () {
                this.partial('./templates/welcome.hbr');
            });
        }

        this.get('#/register', function () {
            console.log('Display register form');
            this.loadPartials({
                header: './templates/common/header.hbr',
                footer: './templates/common/footer.hbr'
            }).then(function () {
                this.partial('./templates/register.hbr');
            });
        });

        this.get('#/contacts', handlers.contacts);

        this.get('#/profile', function () {
            console.log('Edit profile form');
            this.loadPartials({
                header: './templates/common/header.hbr',
                footer: './templates/common/footer.hbr'
            }).then(function () {
                this.partial('./templates/profile.hbr');
            });
        });

        this.get('#/logout', function () {
            console.log('Logout');
            auth.logout()
                .then(this.redirect('index.html'));
        });

        this.post('#/login', function () {
            console.log('Logging in ...');
            let username = this.params.username;
            let password = this.params.password;
            auth.login(username, password)
                .then(this.redirect('#/contacts'));
        });

        this.post('#/register', function () {
            let username = this.params.username;
            let password = this.params.password;
            let repeatPass = this.params.repeatPass;

            if (!username)
                return console.log('Username cannot be empty!');

            if (!password)
                return console.log('Password cannot be empty!');

            if (repeatPass !== password)
                return console.log('Repeat Password is different!');

            auth.register(username, password)
                .then(this.redirect('#/contacts'));
        });

        this.post('#/profile', function () {
            // Handle profile
        });
    }).run();

    // TODO
    // * user search
    // * messages

});