function attachEvents() {
    const btnLoad = $('#btnLoad');
    const result = $('#phonebook');
    const name = $('#person');
    const phone = $('#phone');
    const btnCreate = $('#btnCreate');
    const baseUrl = 'https://phonebook-nakov.firebaseio.com/phonebook';

    btnLoad.on('click', loadPhones);
    btnCreate.on('click', createContact);

    function loadPhones() {
        let req = {
            method: 'GET',
            url: baseUrl + '.json',
            success: displayContacts,
            error: displayError
        };
        $.ajax(req);
    }

    function createContact() {
        let contact = {person: name.val(), phone: phone.val()};

        if (!contact.person || !contact.phone)
            return;

        let req = {
            method: 'POST',
            url: baseUrl + '.json',
            data: JSON.stringify(contact),
            success: () => {
                name.val('');
                phone.val('');
                loadPhones()
            },
            error: displayError
        };

        $.ajax(req);
    }

    function displayContacts(contacts) {
        result.empty();
        Object.keys(contacts)
            .forEach(c => $(`<li>${contacts[c].person}: ${contacts[c].phone} </li>`)
                .append($('<button>[Delete]</button>')
                    .on('click', () => deleteContact(c)))
                .appendTo(result));
    }

    function displayError(err) {
        result.empty();
        result.append($('<li>').text('Error!'));
        console.log(err);
    }

    function deleteContact(key) {
        let req = {
            method: 'DELETE',
            url: `${baseUrl}/${key}.json`,
            success: loadPhones,
            error: displayError
        };
        $.ajax(req);
    }
}