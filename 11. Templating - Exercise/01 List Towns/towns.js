function attachEvents() {
    const fldTowns = $('#towns');
    const result = $('#root');
    const context = {};
    const template = Handlebars.compile($('#towns-template').html());

    $('#btnLoadTowns').on('click', () => {
        context.towns = fldTowns.val().split(', ')
            .map(t => ({name: t}));
        result.html(template(context));
    });
}