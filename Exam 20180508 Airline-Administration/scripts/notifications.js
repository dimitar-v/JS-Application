const notifications = (function () {
// Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").fadeOut() }
    });

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.on('click', function() {$(this).fadeOut()});
        infoBox.find('span').text(message);
        infoBox.fadeIn();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(errorMsg) {
        let errorBox = $('#errorBox');
        errorBox.on('click', function() {$(this).fadeOut()});
        errorBox.find('span').text("Error: " + errorMsg);
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

    return { showInfo, showError, handleAjaxError}
})();