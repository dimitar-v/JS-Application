(function () {
    let btnLoad = $('#btnLoad');
    let btnCreate = $('#btnCreate');
    let results = $('#phonebook');
    let name = $('#person');
    let phone = $('#phone');
    let url = 'https://phonebooksu.firebaseio.com/phonebook';

    btnLoad.on('click', () => loadData());
    btnCreate.on('click', function () {
        let newName = name.val();
        let newPhone = phone.val();
        if (newName && newPhone) {
            let newContact = {
                name: newName,
                phone: newPhone
            };

            $.ajax({
                method: 'POST',
                url: url + '.json',
                dataType: 'JSON',
                data: JSON.stringify(newContact)
            })
                .then(loadData)
                .catch(showError);

            name.val('');
            phone.val('');
        }
    });

    function loadData() {
        results.empty();
        $.get(url + '.json')
            .then(showData)
            .catch(showError);
    }

    function showData(contacts) {
        let keys = Object.keys(contacts);
        for (let key of keys) {
            let contact = contacts[key];
            $(`<li>${contact.name}: ${contact.phone} </li>`)
                .append($('<a href="#">[Delete]</a>').on('click', () => removeContact(key)))
                .appendTo(results);
        }
    }

    function removeContact(key) {
        $.ajax({
            method: 'DELETE',
            url: url + '/' + key + '.json'
        })
            .then(loadData)
            .catch(showError);
    }

    function showError() {
        results.html('<li>Error!</li>');
    }

})();