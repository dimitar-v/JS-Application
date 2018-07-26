function attachEvents() {
    const btnLoad = $('#btnLoadPosts');
    const btnView = $('#btnViewPost');
    const select = $('#posts');
    const postTitle = $('#post-title');
    const postBody = $('#post-body');
    const postComments = $('#post-comments');
    const kinveyApiId = 'kid_By-gOQUEQ';
    const url = 'https://baas.kinvey.com/appdata/5' + kinveyApiId;
    const user = 'peter';
    const pass = 'p';
    const user64auth = btoa(user + ':' + pass); //cGV0ZXI6cA==
    const authHeader = {"Authorization": "Basic " + user64auth};

    btnLoad.on('click', loadPosts);
    btnView.on('click', loadPostAndComments);

    function loadPosts() {
        let requestPosts = $.ajax({
            url: url + '/posts',
            headers: authHeader
        });

        requestPosts
            .then(addPostsToOptions)
            .catch(displayError);
    }

    function loadPostAndComments() {
        let selectedPostId = select.find(":selected").val(); //$('#posts :selected').val()
        let requestPost = $.ajax({
            url: url + '/posts/' + selectedPostId,
            headers: authHeader
        });
        let requestPostComments = $.ajax({
            url: url + `/comments/?query={"post_id":"${selectedPostId}"}`,
            headers: authHeader
        });

        Promise.all([requestPost, requestPostComments])
            .then(displayPostAndComments)
            .catch(displayError);
    }

    function addPostsToOptions(posts) {
        select.empty();
        for (const post of posts)
            $('<option>').text(post.title).val(post._id).appendTo(select);
    }

    function displayPostAndComments([post, comments]) {
        postTitle.text(post.title);
        postBody.text(post.body);

        postComments.empty();
        for (const comment of comments)
            $('<li>').text(comment.text).appendTo(postComments);
    }

    function displayError(error) {
        console.dir(error);
        let errDiv = $('<div>').text(`Error: ${error.status} (${error.statusText})`).attr('style','color:red');

        $(document.body).prepend(errDiv);
        setTimeout(function () {
            errDiv.fadeOut(() => errDiv.remove());
        }, 2000);
    }
}