function attachEvents() {
    const messages = $('#messages');
    const author = $('#author');
    const content = $('#content');
    const send = $('#submit');
    const refresh = $('#refresh');
    const baseUrl = 'https://messagessu.firebaseio.com/messages.json';

    refresh.on('click', loadMessages);

    send.on('click', function () {
        let newMessage = {
            "author": author.val(),
            "content": content.val(),
            "timestamp": Date.now()
        };

        if (newMessage.author && newMessage.content) {
            let requestPost = {
                method: 'POST',
                url: baseUrl,
                data: JSON.stringify(newMessage),
                success: loadMessages,
                error: displayError
            };
            $.ajax(requestPost);

            author.val('');
            content.val('');
        }
    });

    function loadMessages() {
        let requestGet = {
            method: 'GET',
            url: baseUrl,
            success: displayMessages,
            error: displayError
        };
        $.ajax(requestGet);
    }

    function displayMessages(msgs) {
        let result = '';
        Object.keys(msgs)
            .sort((a, b) => msgs[a].timestamp - msgs[b].timestamp)
            .forEach(m => result += `${msgs[m].author}: ${msgs[m].content}\n`);

        messages.text(result);
    }

    function displayError(err) {
        messages.text('Error!');
        console.log(err);
    }
}