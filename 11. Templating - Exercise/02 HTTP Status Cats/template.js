$(() => {
    const result = $('#allCats');
    const context = {cats: window.cats};
    const template = Handlebars.compile($('#cat-template').html());

    renderCatTemplate();

    function renderCatTemplate() {
        result.html(template(context));

        $('.btn').on('click', function () {
            let thisElement = $(this);
            thisElement.children().toggle();
            thisElement.next().toggle('slow');
        });
    }
});