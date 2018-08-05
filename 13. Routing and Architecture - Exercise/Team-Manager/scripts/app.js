const partials = {
    header: './templates/common/header.hbs',
    footer: './templates/common/footer.hbs'
};

$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars','hbs');

        this.get('index.html', displayHome);
        this.get('#/home', displayHome);

        function displayHome() {
            this.loggedIn = sessionStorage.getItem('authtoken') ;
            this.teamId = sessionStorage.getItem('teamId');
            this.hasTeam = this.teamId !== null;
            this.username = sessionStorage.getItem('username');

            this.loadPartials(partials)
                .then(function () {this.partial('./templates/home/home.hbs');});
        }

        this.get('#/about', function () {
            this.loggedIn = sessionStorage.getItem('userAuth');
            this.username = sessionStorage.getItem('username');

            this.loadPartials(partials)
                .then(function () {this.partial('./templates/about/about.hbs');});
        });

        this.get('#/login', function () {
            partials.loginForm = './templates/login/loginForm.hbs';
            this.loadPartials(partials)
                .then( function () {this.partial('./templates/login/loginPage.hbs')});
        });
        
        this.post('#/login', function () {
           let username = this.params.username;
           let password = this.params.password;

            if (!username)
                 auth.showError('Username can not be empty!');
            else if (!password)
                 auth.showError('Password can not be empty!');
            else
                auth.login(username, password)
                .then( userData => {
                    auth.saveSession(userData);
                    auth.showInfo('Logged in!');
                    this.redirect('#/home');
                })
                .catch(auth.handleError);
        });

        this.get('#/register', function () {
            partials.registerForm = './templates/register/registerForm.hbs';
            this.loadPartials(partials)
                .then( function () {this.partial('./templates/register/registerPage.hbs')});
        });

        this.post('#/register', function () {
            let username = this.params.username;
            let password = this.params.password;
            let confirmPassword = this.params.repeatPassword;

            if (!username)
                auth.showError('Username can not be empty!');
            else if (!password)
                auth.showError('Password can not be empty!');
            else if (password !== confirmPassword)
                auth.showError('Passwords not same!');
            else
                auth.register(username, password)
                    .then( userData => {
                        auth.saveSession(userData);
                        auth.showInfo('Registered!');
                        this.redirect('#/catalog');
                    })
                    .catch(auth.handleError);
        });

        this.get('#/logout', function () {
            auth.logout()
                .then(() => {
                   sessionStorage.clear();
                   auth.showInfo('Logged out!');
                    this.redirect('#/home');
                }).catch(auth.handleError);
        });

        this.get('#/catalog', function () {
            this.loggedIn = sessionStorage.getItem('authtoken') ;
            this.hasNoTeam = sessionStorage.getItem('teamId') === null;
            this.username = sessionStorage.getItem('username');

            partials.team = './templates/catalog/team.hbs';
            teamsService.loadTeams()
                .then(teams => {
                    this.teams = teams;
                    this.loadPartials(partials)
                        .then(function () {this.partial('./templates/catalog/teamCatalog.hbs')});
                }).catch(auth.handleError);

        });

        this.get('#/create', function () {
            this.loggedIn = sessionStorage.getItem('authtoken') ;
            this.username = sessionStorage.getItem('username');

            partials.createForm = './templates/create/createForm.hbs';
            this.loadPartials(partials)
                .then(function () {this.partial('./templates/create/createPage.hbs');});
        });

        this.post('#/create', function () {
            let teamName = this.params.name;
            let teamDescription = this.params.comment;

            teamsService.createTeam(teamName, teamDescription)
                .then(teamInfo => {
                    teamsService.joinTeam(teamInfo._id)
                        .then(userInfo => {
                            auth.saveSession(userInfo);
                            auth.showInfo('Team created!');
                            this.redirect('#/catalog');
                        }).catch(auth.handleError);
                }).catch(auth.handleError);
        });

        this.get('#/catalog/:id', function () {
            this.teamId = this.params.id.slice(1);
            this.loggedIn = sessionStorage.getItem('authtoken') ;
            this.username = sessionStorage.getItem('username');

            partials.teamControls = './templates/catalog/teamControls.hbs';
            partials.teamMember = './templates/catalog/teamMember.hbs';
            teamsService.loadTeamDetails(this.teamId)
                .then(team => {
                    this.name = team.name;
                    //this.members = '';
                    this.comment = team.comment;
                    this.isAuthor = team._acl.creator === sessionStorage.getItem('userId');
                    this.isOnTeam = team._id === sessionStorage.getItem('teamId');

                    this.loadPartials(partials)
                        .then(function () { this.partial('./templates/catalog/details.hbs')});
                }).catch(auth.handleError);
        });

        this.get('#/join/:id', function () {
            let teamId = this.params.id.slice(1);

            teamsService.joinTeam(teamId)
                .then(userInfo => {
                    auth.saveSession(userInfo);
                    auth.showInfo('Joined in team!');
                    this.redirect('#/catalog');
                }).catch(auth.handleError);
        });

        this.get('#/leave', function () {
           teamsService.leaveTeam()
               .then(userInfo =>{
                   auth.saveSession(userInfo);
                   auth.showInfo('Left the team!');
                   this.redirect('#/catalog');
               }).catch(auth.handleError);
        });

        this.get('#/edit/:id', function () {
            this.teamId = this.params.id.slice(1);

            teamsService.loadTeamDetails(this.teamId)
                .then(teamInfo => {
                    this.name = teamInfo.name;
                    this.comment = teamInfo.comment;

                    partials.editForm = './templates/edit/editForm.hbs';
                    this.loadPartials(partials)
                        .then(function () {this.partial('./templates/edit/editPage.hbs')});
                }).catch(auth.handleError);
        });

        this.post('#/edit/:id', function () {
            let teamId = this.params.id.slice(1);
            let name = this.params.name;
            let description = this.params.comment;

            teamsService.edit(teamId, name, description)
                .then(() => {
                    auth.showInfo('Team edited!');
                    this.redirect('#/catalog');
                }).catch(auth.handleError);
        });
    });

    app.run();
});