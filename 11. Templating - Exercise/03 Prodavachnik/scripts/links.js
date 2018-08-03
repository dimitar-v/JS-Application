(function () {
    class Link {
        constructor(id, target, title, ) {
            this.id = id;
            this.target = target;
            this.title = title;
        }
    }

    window.links = [
        new Link('linkHome', 'viewHome', 'Home'),
        new Link('linkLogin', 'viewLogin', 'Login'),
        new Link('linkRegister', 'viewRegister', 'Register'),
        new Link('linkListAds', 'viewAds', 'List Advertisements'),
        new Link('linkCreateAd', 'viewCreateAd', 'Create Advertisement'),
        new Link('linkLogout', '', 'Logout')
    ];
})()