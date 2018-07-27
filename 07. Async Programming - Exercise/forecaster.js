function attachEvents() {
    const location = $('#location');
    const divForecast = $('#forecast');
    const divCurrent = $('#current');
    const divUpcoming = $('#upcoming');
    const url = 'https://judgetests.firebaseio.com/';
    const symbols = {
        Sunny: '&#x2600', // ☀
        'Partly sunny': '&#x26C5', // ⛅
        Overcast: '&#x2601', // ☁
        Rain: '&#x2614'  // ☂
    };
    let myLocation;

    $('#submit').on('click', getLocations);

    function getLocations() {
        myLocation = location.val();
        location.val('');

        if (!myLocation) {
            return showError();
        }

        sendRequest('locations.json')
            .then(compareLocations)
            .catch(showError);
    }

    function compareLocations(locations) {
        let myLocationCode = locations
            .filter(l => l.name === myLocation)
            .map(c => c.code)[0];

        if (!myLocationCode) {
            return showError();
        }

        Promise.all([sendRequest(`forecast/today/${myLocationCode}.json`),
            sendRequest(`forecast/upcoming/${myLocationCode}.json`)])
            .then(showWeather)
            .catch(showError);
    }

    function showWeather([today, upcoming]) {
        const degr = '&#176'; // °
        let todayFC = today.forecast;
        divForecast.removeAttr('style');
        let fragment = document.createDocumentFragment();

        divCurrent.empty();
        $('<div class="label">Current conditions</div>')
            .appendTo(fragment);
        $(`<span class="conditon symbol">${symbols[todayFC.condition]}</span>`)
            .appendTo(fragment);
        $('<span class="condition">')
            .append($(`<span class="forecast-data">${today.name}</span>`))
            .append($(`<span class="forecast-data">${todayFC.low}${degr}/${todayFC.high}${degr}</span>`))
            .append($(`<span class="forecast-data">${todayFC.condition}</span>`))
            .appendTo(fragment);
        divCurrent.append(fragment);

        divUpcoming.empty();
        $('<div class="label">Three-day forecast</div>')
            .appendTo(fragment);
        for (let day of upcoming.forecast) {
            $('<span class="upcoming">')
                .append($(`<span class="symbol">${symbols[day.condition]}</span>`))
                .append($(`<span class="forecast-data">${day.low}${degr}/${day.high}${degr}</span>`))
                .append($(`<span class="forecast-data">${day.condition}</span>`))
                .appendTo(fragment);
        }
        divUpcoming.append(fragment);
    }

    function showError() {
        divForecast.removeAttr('style')
            .text('Error');
    }

    function sendRequest(extend) {
        return $.ajax({url: url + extend});
    }
}