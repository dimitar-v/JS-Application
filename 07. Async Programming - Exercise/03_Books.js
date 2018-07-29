const basicUrl = 'https://baas.kinvey.com/appdata/kid_B1vN8aFEQ/books/';
const authorization = {'Authorization': 'Basic ' + btoa('SoftUni:su')};
const divBooks = $('#books');
const addForm = $('#addForm');
const btnAdd = $('button.add');
const btnUpdate = $('button.update');
let fldTitle = addForm.find('.title');
let fldAuthor = addForm.find('.author');
let fldIsbn = addForm.find('.isbn');
let fldTags = addForm.find('.tags');

class Book{
    constructor(id,author, title, ISBN, tags = '.'){
        this.id = id;
        this.author = author;
        this.title = title;
        this.ISBN = ISBN;
        this.tags = tags
    }
}

(function () {
    loadBooks();
})();

function loadBooks() {
    sendRequest('GET')
        .then(showBooks)
        .catch(showError)
}

function showBooks(books) {
    divBooks.empty();
    for (const book of books) {
        let b = new Book(book._id, book.author, book.title, book.isbn, book.tags);
        $(`<div class="book" data-id="${b.id}">`)
            .append($(`<label>Author</label>`))
            .append($(`<p class="author">${b.author}</p><hr>`))
            .append($(`<label>Title</label>`))
            .append($(`<p class="title">${b.title}</p><hr>`))
            .append($(`<label>ISBN</label>`))
            .append($(`<input class="isbn" value="${b.ISBN}" disabled="true"/><hr>`))
            .append($(`<label>Tags</label>`))
            .append($(`<p class="tags">${b.tags}</p><hr>`))
            .append($(`<button class="edit">Edit</button>`).on('click', editBook))
            .append($(`<button class="delete">Delete</button>`).on('click', deleteBook))
            .appendTo(divBooks)
    }
}

function addBook() {
    if(!fldAuthor.val() || !fldTitle.val() || !fldIsbn.val()){
        let error = {statusText: 'Some fields of Author, Title or ISBN not filled!'};
        return showError(error);
    }
    sendRequest('POST')
        .then(loadBooks)
        .catch(showError)
}

function editBook() {
    btnAdd.attr('disabled','true');
    btnUpdate.removeAttr('disabled');

    let thisBook = $(this).parent();
    fldAuthor.val(thisBook.find('.author').text());
    fldTitle.val(thisBook.find('.title').text());
    fldIsbn.val(thisBook.find('.isbn').val());
    fldTags.val(thisBook.find('.tags').text());
    addForm.attr('data-id', thisBook.attr('data-id'))
}

function updateBook() {
    if(!fldAuthor.val() || !fldTitle.val() || !fldIsbn.val()){
        let error = {statusText: 'Some fields of Author, Title or ISBN not filled!'};
        return showError(error);
    }
    let id  = addForm.attr('data-id');
    addForm.removeAttr('data-id');
    btnAdd.removeAttr('disabled');
    btnUpdate.attr('disabled','true');
    sendRequest('PUT', id)
        .then(loadBooks)
        .catch(showError)
}

function deleteBook() {
    $(this).attr('disabled', 'true');
    sendRequest('DELETE',$(this).parent().attr('data-id'))
        .then(loadBooks)
        .catch(showError)
}

function sendRequest(method, ext = '') {
    let body = '';

    if (method ==='POST' || method ==='PUT'){
        body = JSON.stringify({
            title: fldTitle.val(),
            author: fldAuthor.val(),
            isbn: fldIsbn.val(),
            tags: fldTags.val()
        });
        fldTitle.val('');
        fldAuthor.val('');
        fldIsbn.val('');
        fldTags.val('');
    }

    return $.ajax({
        method: method,
        url: basicUrl + ext,
        headers: authorization,
        contentType: "application/json",
        data: body
    });
}

function showError(error) {
    let errDiv = $('<div>').text(`Error: ${error.status} (${error.statusText})`).attr('style','color:red');

    $(document.body).prepend(errDiv);
    setTimeout(function () {
        errDiv.fadeOut(() => errDiv.remove());
    }, 2000);
}



