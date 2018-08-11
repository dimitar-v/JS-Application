const appController = {};

$(() => {
    Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html',appController.displayWelcome);
        this.get('#/home', appController.displayWelcome);
        this.get('#', appController.displayWelcome);

        this.post('#/login', appController.login);
        this.post('#/register', appController.register);
        this.get('#/logout', appController.logout);

        this.get('#/catalog', appController.displayCatalog);

        this.get('#/createPost', appController.displayCreatePost);
        this.post('#/createPost', appController.createPost);

        this.get('#/edit/:id', appController.viewEditPost);
        this.post('#/edit/:id', appController.editPost);

        this.get('#/delete/:id', appController.deletePost);

        this.get('#/myPosts', appController.displayMyPosts);

        this.get('#/details/:id', appController.postDetails);

        this.post('#/comment/:id', appController.postComments);
        this.get('#/comment/delete/:commentId/post/:postId', appController.deleteComment)

    }).run()
});