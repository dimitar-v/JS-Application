function startApp() {
    const menuHeader = $('#menu');
    const adsDiv = $('#ads');
    const viewDetails = $('#viewDetailsAd');
    const templates = {};
    const linksContext = {links: window.links};
    const adsContext = {ads:[]};

    loadTemplates();
    navigateTo('', 'viewHome');

    function navigateTo(e, t) {
        let target = $(e.target).attr('data-target');
        $('section').hide();
        if (t) target = t;
        if (target === 'viewAds') loadAds();

        $('#' + target).show();
    }

    // Notifications
    // Bind the info / error boxes
    $("#infoBox, #errorBox").on('click', function() {$(this).fadeOut()});

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").fadeOut() }
    });

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showError(errorMsg) {
        let errorBox = $('#errorBox');
        errorBox.text("Error: " + errorMsg);
        errorBox.show();
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }

    let sendRequest = (() => {
        const baseUrl = 'https://baas.kinvey.com/';
        const appKey = 'kid_ry-56q2EQ';
        const appSecret = '598fc4cb189a4cebb838f6801e635466';

        function makeAuth(type) {
            if (type === 'basic') return 'Basic ' + btoa(appKey + ':' + appSecret);
            else return 'Kinvey ' + localStorage.getItem('authToken');
        }

        function makeRequest(method, module, urlExt, auth) {
            return {
                url: baseUrl + module + '/' + appKey + '/' + urlExt,
                method: method,
                headers: {Authorization: makeAuth(auth)}
            };
        }

        function get(module, urlExt, auth) {
            return $.ajax(makeRequest('GET', module, urlExt, auth));
        }

        function post(module, urlExt, data, auth) {
            let req = makeRequest('POST', module, urlExt, auth);
            req.data = JSON.stringify(data);
            req.contentType = "application/json";
            return $.ajax(req);
        }

        function update(module, urlExt, data, auth) {
            let req = makeRequest('PUT', module, urlExt, auth);
            req.data = JSON.stringify(data);
            req.contentType = "application/json";
            return $.ajax(req);
        }

        function remove(module, urlExt, auth) {
            return $.ajax(makeRequest('DELETE', module, urlExt, auth));
        }

        return {get, post, update, remove};
    })();

    async function loadTemplates(){
        const [linksSource, adsSource, adSource] =
            await Promise.all([$.get('./templates/links.html'), $.get('./templates/ads.html'), $.get('./templates/showAd.html')]);
        templates.links = Handlebars.compile(linksSource);
        templates.ads = Handlebars.compile(adsSource);
        templates.showAd = Handlebars.compile(adSource);

        showLinks();
    }

    function showLinks() {
        menuHeader.html(templates.links(linksContext));
        menuHeader.append($('<span id="loggedInUser" class="menu-item"></span>'));
        menuHeader.find('a').show();

        attachEventListeners();

        if (localStorage.getItem('authToken') && localStorage.getItem('username')) {
            userLoggedIn();
        } else {
            userLoggedOut();
        }
    }

    // Attach event listeners
    function attachEventListeners() {
        menuHeader.find('a[data-target]').on('click', navigateTo);
        $('#buttonLoginUser').on('click', login);
        $('#buttonRegisterUser').on('click', register);
        $('#linkLogout').on('click', () => logout());
        $('#buttonCreateAd').on('click', createAd);
        $('#formEditAd').find('#buttonEditAd').on('click', updateAd);
    }

    // User actions
    function userLoggedIn() {
        let welcome = $('#loggedInUser');
        welcome.text(`Welcome, ${localStorage.getItem('username')}!`);
        welcome.show();
        $('#linkLogin').hide();
        $('#linkRegister').hide();
        $('#linkListAds').show();
        $('#linkCreateAd').show();
        $('#linkLogout').show();
    }

    function userLoggedOut() {
        let welcome = $('#loggedInUser');
        welcome.text('');
        welcome.hide();
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkListAds').hide();
        $('#linkCreateAd').hide();
        $('#linkLogout').hide();
    }

    function saveSession(data) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('id', data._id);
        localStorage.setItem('authToken', data._kmd.authtoken);
        userLoggedIn();
    }

    async function login() {
        let form = $('#formLogin');
        let userData = {
            username: form.find('input[name="username"]').val(),
            password: form.find('input[name="passwd"]').val()
        };

        try {
            let data = await sendRequest.post('user', 'login', userData, 'basic');
            showInfo('Logged in');
            saveSession(data);
            navigateTo('', 'viewAds');
        } catch (e) {
            handleAjaxError(e);
        }
    }

    async function register() {
        let form = $('#formRegister');
        let userData = {
            username: form.find('input[name="username"]').val(),
            password: form.find('input[name="passwd"]').val()
        };

        try {
            let data = await sendRequest.post('user', '', userData, 'basic');
            showInfo('Registered');
            saveSession(data);
            navigateTo('', 'viewAds');
        } catch (e) {
            handleAjaxError(e);
        }
    }

    async function logout() {
        try {
            let data = await sendRequest.post('user', '_logout', {authtoken: localStorage.getItem('authToken')});
            localStorage.clear();
            showInfo('Logged out');
            userLoggedOut();
            navigateTo('', 'viewHome');
        } catch (e) {
            handleAjaxError(e);
        }
    }

    // Ads CRUD actions
    async function loadAds() {
        adsContext.ads = await sendRequest.get('appdata', 'ads');
        adsContext.ads.forEach(ad => {
            ad.price = '' + ad.price.toFixed(2);
            if (ad._acl.creator === localStorage.getItem('id')) ad.owner = true
        });
        adsDiv.html(templates.ads(adsContext));

        $('.view').on('click', function() {

            let id = $(this).parent().parent().attr('data-ad-id');
            displayAdvert(adsContext.ads.filter(ad => ad._id === id)[0]);
        });

        $('.edit').on('click', function() {
            let id = $(this).parent().parent().attr('data-ad-id');
            openEditAd(adsContext.ads.filter(ad => ad._id === id)[0]);
        });

        $('.delete').on('click', function() {
            deleteAd($(this).parent().parent().attr('data-ad-id'));
        });
    }

    async function createAd() {
        let dateSplit = (new Date()).toISOString().slice(0,10).split('-');

        let form = $('#formCreateAd');
        let adData = {
            title: form.find('input[name="title"]').val(),
            description: form.find('textarea[name="description"]').val(),
            date: dateSplit[1] + '/' + dateSplit[2] + '/' + dateSplit[0],// MM/dd/yyyy  form.find('input[name="datePublished"]').val(),
            price: +form.find('input[name="price"]').val(),
            imageUrl: form.find('input[name="image"]').val(),
            publisher: localStorage.getItem('username')
        };

        form.find('input[name="title"]').val('');
        form.find('textarea[name="description"]').val('');
        form.find('input[name="price"]').val('');
        form.find('input[name="image"]').val('');

        if (!adData.title)
            return showError('Title cannot be empty!');

        if (!adData.price)
            return showError('Price cannot be empty!');

        try {
            await sendRequest.post('appdata', 'ads', adData);
            showInfo('Ad created');
            navigateTo('', 'viewAds');
        } catch (e) {
            handleAjaxError(e)
        }
    }
    
    function openEditAd(ad) {
        let form = $('#formEditAd');
        form.find('input[name="title"]').val(ad.title);
        form.find('textarea[name="description"]').val(ad.description);
        form.find('input[name="price"]').val(ad.price);
        form.find('input[name="image"]').val(ad.imageUrl);

        sessionStorage.setItem('adId', ad._id);
        sessionStorage.setItem('date', ad.date);

        navigateTo('', 'viewEditAd');
    }

    async function updateAd() {
        let form = $('#formEditAd');
        let adData = {
            title: form.find('input[name="title"]').val(),
            description: form.find('textarea[name="description"]').val(),
            date: sessionStorage.getItem('date'),
            price: +form.find('input[name="price"]').val(),
            imageUrl: form.find('input[name="image"]').val(),
            publisher: localStorage.getItem('username')
        };

        if (!adData.title)
            return showError('Title cannot be empty!');

        if (!adData.price)
            return showError('Price cannot be empty!');

        try {
            await sendRequest.update('appdata', 'ads/' + sessionStorage.getItem('adId'), adData);
            showInfo('Ad edited');
            navigateTo('', 'viewAds');
        } catch (e) {
            handleAjaxError(e)
        }
    }

    function displayAdvert(ad) {
        viewDetails.html(templates.showAd(ad));
        navigateTo('', 'viewDetailsAd');
    }

    async function deleteAd(id) {
        try {
            await sendRequest.remove('appdata', 'ads/' + id);
            navigateTo('', 'viewAds');
        } catch (e) {
            handleAjaxError(e)
        }
    }
}