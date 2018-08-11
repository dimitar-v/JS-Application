function getPartials(section) {
    return {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        section: `./templates/sections/${section}.hbs`
    }
}

function getUser(ctx) { ctx.user = sessionStorage.getItem('username')}

function convertDates(str) {
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let d = new Date(str);
    return d.getDate() +' '+ monthName[d.getMonth()];
}

function verifyInputFields (input) {
    getUser(this);
    let {destination, origin, departureDate, departureTime, seats, cost, img, public} = input;

    if (!destination) return 'Destination can not be empty!';
    if (!origin) return 'Origin can not be empty!';
    if (!seats || +seats < 0) return 'Seats should be positive number!';
    if (!cost || +cost < 0) return 'Cost should be positive number!';

    return {destination, origin, departureDate, departureTime, seats, cost, imgUrl: img, isPublic: public ==='on', author: this.user};
}

appController.displayWelcome =  function () {
    getUser(this);

    this.loadPartials(getPartials('viewCatalog'))
        .then(function () { this.partial('./templates/common/main.hbs')});
};

appController.displayLogin = function () {
    getUser(this);

    this.loadPartials(getPartials('viewLogin'))
        .then(function () { this.partial('./templates/common/main.hbs')});
};

appController.login = function () {
    let {username, pass} = this.params;

    if (!/^.{5,}$/.test(username)) return notifications.showError('A username should be at least 5 characters long and should contain only english alphabet letters.');
    if (!pass) return notifications.showError('Password can not be empty!');

    auth.login(username, pass)
        .then( userData => {
            auth.saveSession(userData);
            notifications.showInfo('Login successful.');
            this.redirect('#/catalog');
        }).catch(notifications.handleAjaxError);
};

appController.displayRegister = function () {
    getUser(this);

    this.loadPartials(getPartials('viewRegister'))
        .then(function () { this.partial('./templates/common/main.hbs')});
};

appController.register = function () {
    let {username, pass, checkPass } = this.params;

//    if (!username) return notifications.showError('Username can not be empty!');
    if (!/^.{5,}$/.test(username)) return notifications.showError('A username should be at least 5 characters long and should contain only english alphabet letters.');
    if (!pass) return notifications.showError('Password can not be empty!');
//    if (!/^[A-Za-z0-9]{6,}$/.test(pass)) return notifications.showError('A user‘s password should be at least 6 characters long and should contain only english alphabet letters and digits.');
    if (pass !== checkPass) return notifications.showError('Password should match!');

    auth.register(username, pass)
        .then( userData => {
            auth.saveSession(userData);
            notifications.showInfo('User registration successful.');
            this.redirect('#/catalog');
        }).catch(notifications.handleAjaxError);
};

appController.logout = function () {
    auth.logout()
        .then(() => {
            sessionStorage.clear();
            notifications.showInfo('Logout successful.');
            this.redirect('#/login');
        }).catch(notifications.handleAjaxError);
};

appController.displayCatalog = function () {
    if (!auth.isAuthed()) return this.redirect('#');
    getUser(this);

    sendRequest.get('appdata', 'flights?query={"isPublic":true}')
        .then((flights) => {
            flights.forEach(f => f.date = convertDates(f.departureDate));
            this.flights = flights;
            this.loadPartials(getPartials('viewCatalog'))
                .then(function () { this.partial('./templates/common/main.hbs')});
        }).catch(notifications.handleAjaxError);
};

appController.displayAddFlight = function () {
    if (!auth.isAuthed()) return this.redirect('#');
    getUser(this);

    this.loadPartials(getPartials('viewAddFlight'))
        .then(function () {this.partial('./templates/common/main.hbs')});
};

appController.addFlight = function () {
    if (!auth.isAuthed()) return this.redirect('#');

    let flightDetails = verifyInputFields(this.params);
    if(typeof flightDetails === 'string') return notifications.showError(flightDetails);

    sendRequest.post('appdata', 'flights', flightDetails)
        .then(() => {
            notifications.showInfo('Flights created.');
            this.redirect('#/catalog');
        }).catch(notifications.handleAjaxError);
};

appController.flightDetails = function ()  {
    if (!auth.isAuthed()) return this.redirect('#');
    getUser(this);
    let flightId = this.params.id.slice(1);
    sendRequest.get('appdata', 'flights/' + flightId)
        .then(flight => {
            flight.date = convertDates(flight.departureDate);
            flight.isAuthor = this.user === flight.author;
            this.flight = flight;
            this.loadPartials(getPartials('viewFlightDetails'))
                .then(function () {
                    this.partial('./templates/common/main.hbs')
                    // .then(() => { // delete comment
                    //     $('a[data-comment-id]').click(function (event) {
                    //         event.preventDefault();
                    //         let link = $(this);
                    //         sendRequest.del('appdata', 'comments/' + link.attr('data-comment-id'))
                    //             .then(() => {
                    //                 notifications.showInfo('Comment deleted.');
                    //                 link.parent().parent().remove();
                    //             }).catch(notifications.handleAjaxError);
                    // });
                    // });
                });
        }).catch(notifications.handleAjaxError);
};

appController.viewEditFlight = function () {
    if (!auth.isAuthed()) return this.redirect('#');
    getUser(this);
    let flightId = this.params.id.slice(1);
    sendRequest.get('appdata', 'flights/' + flightId)
        .then(flight => {
            if (this.user !== flight.author) return this.redirect('#');
            this.flight = flight;
            this.loadPartials(getPartials('viewEditFlight'))
                .then(function () {this.partial('./templates/common/main.hbs')});
        }).catch(notifications.handleAjaxError);
};

appController.editFlight = function () {
    if (!auth.isAuthed()) return this.redirect('#');
    let flightId = this.params.id.slice(1);

    let flightDetails = verifyInputFields(this.params);
    if(typeof flightDetails === 'string') return notifications.showError(flightDetails);

    sendRequest.update('appdata', 'flights/' + flightId, flightDetails)
        .then(() => {
            notifications.showInfo('Successfully edited flight.');
            this.redirect('#/details/:' + flightId);
        }).catch(notifications.handleAjaxError);

};

appController.displayMyFlights = function () {
    if (!auth.isAuthed()) return this.redirect('#');
    getUser(this);
    sendRequest.get('appdata', `flights?query={"author":"${this.user}"}&sort={"_kmd.ect": -1}`)
        .then((flights) => {
            flights.forEach(f => f.date = convertDates(f.departureDate));
            this.flights = flights;
            this.loadPartials(getPartials('viewMyFlights'))
                .then(function () { this.partial('./templates/common/main.hbs')});
        }).catch(notifications.handleAjaxError);
};

appController.deleteFlight = function () {
    if (!auth.isAuthed()) return this.redirect('#');
    let flightId = this.params.id.slice(1);
    sendRequest.del('appdata', 'flights/' + flightId)
        .then(() => {
            notifications.showInfo('Flight deleted.');
            this.redirect('#/myFlights');
        }).catch(notifications.handleAjaxError);
};