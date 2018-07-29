const basicUrl = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students/';
const authorization = {'Authorization': 'Basic ' + btoa('guest:guest')};
const table = $('#results');
const addForm = $('#addForm');
let fldId = addForm.find('.id');
let fldFName = addForm.find('.fname');
let fldLName = addForm.find('.lname');
let fldFNumber = addForm.find('.fnumber');
let fldGrade = addForm.find('.grade');

(function () {
    loadStudents();
})();

function loadStudents() {
    sendRequest('GET', '?query={}&sort={"ID":1,"FacultyNumber":1}')
        .then(showStudents)
        .catch(showError)
}

function showStudents(students) {
    table.empty();
    $('<tbody>')
        .append($('<tr>')
            .append($('<th>ID</th>'))
            .append($('<th>First Name</th>'))
            .append($('<th>Last Name</th>'))
            .append($('<th>Faculty Number</th>'))
            .append($('<th>Grade</th>')))
        .appendTo(table);
    for (const student of students) {
        $('<tr>')
            .append($('<td>').text(student.ID))
            .append($('<td>').text(student.FirstName))
            .append($('<td>').text(student.LastName))
            .append($('<td>').text(student.FacultyNumber))
            .append($('<td>').text(student.Grade))
            .appendTo(table);
    }
}

function addStudent() {
    let isIdNumber = (/^[0-9]+$/).test(fldId.val());
    let isFNameNonEmptySting = fldFName.val() !== '';
    let isLNameNonEmptySting = fldLName.val() !== '';
    let isFNumberAreStringOfNumbers = (/^[0-9]+$/).test(fldFNumber.val());
    let grade = +fldGrade.val();
    let isGrade = grade <= 6 && grade >= 2;

    if (!isIdNumber || !isFNameNonEmptySting || !isLNameNonEmptySting || !isFNumberAreStringOfNumbers || !isGrade)
        return showError({statusText: 'Invalid input data!'});

    sendRequest('POST')
        .then(loadStudents)
        .catch(showError);
}

function showError(error) {
    let errDiv = $('<div>').text(`Error: ${error.status} (${error.statusText})`).attr('style', 'color:red');

    $(document.body).prepend(errDiv);
    setTimeout(function () {
        errDiv.fadeOut(() => errDiv.remove());
    }, 3000);
}

function sendRequest(method, ext = '') {
    let body = '';

    if (method === 'POST') {
        body = JSON.stringify({
            ID: +fldId.val(),
            FirstName: fldFName.val(),
            LastName: fldLName.val(),
            FacultyNumber: fldFNumber.val(),
            Grade: +fldGrade.val()
        });
        console.log(body);
        fldId.val('');
        fldFName.val('');
        fldLName.val('');
        fldFNumber.val('');
        fldGrade.val('');
    }

    return $.ajax({
        method: method,
        url: basicUrl + ext,
        headers: authorization,
        contentType: "application/json",
        data: body
    });
}