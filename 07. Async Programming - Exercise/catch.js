function attachEvents() {
    const result = $('#catches');
    const addForm = $('#addForm');
    const autorize = {'Authorization': 'Basic ' + btoa('SoftUni:su')};
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_rydMgcuNQ/biggestCatches/';

    $('button.load').on('click', loadCatches);
    $('button.add').on('click', addCatch);

    function loadCatches() {
        createRequest('', 'GET')
            .then(showCatches)
            .catch(showError);

        function showCatches(catches) {
            result.empty();
            for (const c of catches) {
                $(`<div class="catch" data-id="${c._id}">`)
                    .append($(`<label>Angler</label>`))
                    .append($(`<input type="text" class="angler" value="${c.angler}"/>`))
                    .append($(`<label>Weight</label>`))
                    .append($(`<input type="number" class="weight" value="${c.weight}"/>`))
                    .append($(`<label>Species</label>`))
                    .append($(`<input type="text" class="species" value="${c.species}"/>`))
                    .append($(`<label>Location</label>`))
                    .append($(`<input type="text" class="location" value="${c.location}"/>`))
                    .append($(`<label>Bait</label>`))
                    .append($(`<input type="text" class="bait" value="${c.bait}"/>`))
                    .append($(`<label>Capture Time</label>`))
                    .append($(`<input type="number" class="captureTime" value="${c.captureTime}"/>`))
                    .append($(`<button>`).attr('class', 'update').text('Update').on('click', updateCatch))
                    .append($(`<button>`).attr('class', 'delete').text('Delete').on('click', () => deleteCatch(c._id)))
                    .appendTo(result);
            }
        }
    }

    function addCatch() {
        createRequest('', 'POST', addForm)
            .then(loadCatches)
            .catch(showError);
    }
    
    function updateCatch() {
        let thisCatch =  $(this).parent();
        createRequest(thisCatch.attr('data-id'), 'PUT', thisCatch)
            .then(loadCatches)
            .catch(showError);
    }
    
    function deleteCatch(id) {
        createRequest(id, 'DELETE')
            .then(loadCatches)
            .catch(showError);
    }

    function createRequest(urlExt, method, selector) {
        let body = '';

        if (method === 'POST' || method === 'PUT')
            body = JSON.stringify({
                angler: selector.find('.angler').val(),
                weight: +selector.find('.weight').val(),
                species: selector.find('.species').val(),
                location: selector.find('.location').val(),
                bait: selector.find('.bait').val(),
                captureTime: +selector.find('.captureTime').val()
            });

        return $.ajax({
            method: method,
            url: baseUrl + urlExt,
            headers: autorize,
            contentType: "application/json",
            data: body
        });
    }

    function showError(error) {
        console.log(error);
    }
}