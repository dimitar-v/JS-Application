const app = Sammy('#main', function () {
    this.get('index.html', (context) => context.swap('<h2>Home Page</h2>'));
    this.get('#/about', () => this.swap('<h2>About Page</h2>'));
    this.get('#/contact', () => this.swap('<h2>Contact Page</h2>'));
    this.get('#/catalog', displayCatalog);
    this.get('#/catalog/:productId', displayCatalog);

    function displayCatalog(context) {
        context.swap('<h2>Catalog</h2>' +
        '<a href="#/catalog/01">Product 1</a> ' +
        '<a href="#/catalog/02">Product 2</a> ' +
        '<a href="#/catalog/03">Product 3</a> ' +
        '<a href="#/catalog/04">Product 4</a> ')

        console.log(context.params);
    }

    this.get('#/login', () => {
       this.swap('<form action="#/login" method="post">' +
           'User: <input name="user" type="text"><br>' +
           'Pass: <input name="pass" type="password"><br>' +
           '<input type="submit" value="Login">')
    });

    this.post('#/login', (context) => {
        console.log(context.params.user);
        console.log(context.params.pass);
    })
});

$(() => {
   app.run();
});