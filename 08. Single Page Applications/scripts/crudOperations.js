const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_rJNDb7oVm';
const APP_SECRET = '3efa74d417db45d4bb47db5cbcc5a096';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
const BOOKS_PER_PAGE = 10;

function loginUser() {
    let userData = {
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=passwd]').val()
    };

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/login',
        headers: AUTH_HEADERS,
        data: JSON.stringify(userData),
        contentType: "application/json",
        success: (res) => signInUser(res, 'Login successful.'),
        error: handleAjaxError
    });
}

function registerUser() {
    let userData = {
        username: $('#formRegister input[name=username]').val(),
        password: $('#formRegister input[name=passwd]').val()
    };

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/',
        headers: AUTH_HEADERS,
        data: JSON.stringify(userData),
        contentType: "application/json",
        success: (res) => signInUser(res, 'Registration successful.'),
        error: handleAjaxError
    });
}

function listBooks() {
    showView('viewBooks');
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/books',
        headers: getKinveyUserAuthHeaders(),
        success: (res) => displayPaginationAndBooks(res.reverse()),
        error: handleAjaxError,
    });
}

function createBook() {
    let bookData = {
        title: $('#formCreateBook input[name=title]').val(),
        author: $('#formCreateBook input[name=author]').val(),
        description: $('#formCreateBook textarea[name=description]').val()
    };

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/books',
        headers: getKinveyUserAuthHeaders(),
        data: bookData,
        success: () => {
            showInfo('Book created.');
            listBooks();
        },
        error: handleAjaxError,
    });
}

function deleteBook(book) {
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id,
        headers: getKinveyUserAuthHeaders(),
        success: () => {
            showInfo('Book deleted.');
            listBooks();
        },
        error: handleAjaxError,
    });
}

function loadBookForEdit(book) {
    showView('viewEditBook');
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id,
        headers: getKinveyUserAuthHeaders(),
        success: (res) => displayBooksForEdit(res),
        error: handleAjaxError,
    });
    
    function displayBooksForEdit(book) {
        $('#formEditBook input[name=id]').val(book._id);
        $('#formEditBook input[name=title]').val(book.title);
        $('#formEditBook input[name=author]').val(book.author);
        $('#formEditBook textarea[name=description]').val(book.description);
    }
}

function editBook() {
    let bookData = {
        id: $('#formEditBook input[name=id]').val(),
        title: $('#formEditBook input[name=title]').val(),
        author: $('#formEditBook input[name=author]').val(),
        description: $('#formEditBook textarea[name=description]').val()
    };

    $.ajax({
        method: 'PUT',
        url: BASE_URL + 'appdata/' + APP_KEY + '/books/' + bookData.id ,
        headers: getKinveyUserAuthHeaders(),
        data: bookData,
        success: () => {
            showInfo('Book edited.');
            listBooks();
        },
        error: handleAjaxError,
    });
}

function saveAuthInSession(userInfo) {
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
    sessionStorage.setItem('username', userInfo.username);
    sessionStorage.setItem('userId', userInfo._id);
}

function getKinveyUserAuthHeaders() {
    return { Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')};
}

function logoutUser() {
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/_logout',
        headers: getKinveyUserAuthHeaders(),
        contentType: "application/json",
        success: () => {
            sessionStorage.clear();
            showHideMenuLinks();
            showHomeView();
            showInfo('Logout successful.');
        },
        error: handleAjaxError
    });
}

function signInUser(res, message) {
    saveAuthInSession(res);
    showHideMenuLinks();
    listBooks();
    showInfo(message);
}

function displayPaginationAndBooks(books) {
    const BOOK_TABLE = $('#books > table');
    let pagination = $('#pagination-demo');
    if(pagination.data("twbs-pagination")){
        pagination.twbsPagination('destroy')
    }
    pagination.twbsPagination({
        totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
        visiblePages: 5,
        next: 'Next',
        prev: 'Prev',
        onPageClick: function (event, page) {
            BOOK_TABLE.find('tr').each((i,e) => {if(i)e.remove()});
            let startBook = (page - 1) * BOOKS_PER_PAGE;
            let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length);
            $(`a:contains(${page})`).addClass('active');
            for (let i = startBook; i < endBook; i++)
                createTr(books[i])
                    .appendTo(BOOK_TABLE);
        }
    });

    function createTr(book) {
        let links = [];
        if (book._acl.creator === sessionStorage.getItem('userId')) {
            links.push($("<a href='#'>").text('[Edit]').on('click', () => loadBookForEdit(book)));
            links.push('   ');
            links.push($("<a href='#'>").text('[Delete]').on('click', () => deleteBook(book)));
        }

        return $('<tr>')
            .append(
                $('<td>').text(book.title),
                $('<td>').text(book.author),
                $('<td>').text(book.description),
                $('<td>').append(links)
            );
    }
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg);
}