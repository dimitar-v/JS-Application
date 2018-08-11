const appController = {};

$(() => {
    Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html',appController.displayWelcome);
        this.get('#/home', appController.displayWelcome);
        this.get('#', appController.displayWelcome);

        this.get('#/login', appController.displayLogin);
        this.post('#/login', appController.login);
        this.get('#/register', appController.displayRegister);
        this.post('#/register', appController.register);
        this.get('#/logout', appController.logout);

        this.get('#/catalog', appController.displayCatalog);

        this.get('#/addFlight', appController.displayAddFlight);
        this.post('#/addFlight', appController.addFlight);

        this.get('#/details/:id', appController.flightDetails);

        this.get('#/edit/:id', appController.viewEditFlight);
        this.post('#/edit/:id', appController.editFlight);

        this.get('#/myFlights', appController.displayMyFlights);

        this.get('#/delete/:id', appController.deleteFlight);
    }).run()
});