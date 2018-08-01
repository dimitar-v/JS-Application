$(() => {

    const templates = {};
    const context = {
        contacts:[]
    };

    const listContacts = $('#list').find('.content');
    const listDetails = $('#details').find('.content');

    listContacts.html($('<span style="font-style: italic">Loading &hellip;</span>'));
    listDetails.html($('<div class="info" style="font-style: italic"><span>Select contact from list to view details</span></div>'));

    loadData();
    loadTemplates();


    async function loadData() {
        context.contacts = await $.get('data.json');
    }

    async function loadTemplates() {
        const [contactSource, contactsList, detailsSource] =
            await Promise.all([$.get('./templates/contact.html'), $.get('./templates/contactsList.html'), $.get('./templates/details.html')]);

        Handlebars.registerPartial('contact', contactSource);
        templates.list = Handlebars.compile(contactsList);
        templates.details = Handlebars.compile(detailsSource);

        showList();
    }

    function showList() {
        listContacts.html(templates.list(context));
        attachHendlers();
    }
    
    function showDetails(index) {
        listDetails.html(templates.details(context.contacts[index]));
    }
    
    function attachHendlers() {
        $('.content').on('click', (e) => {
            let index = $(e.target).closest('.contact').attr('data-index');
            context.contacts.forEach(c => c.active = false); //add active functionality
            context.contacts[index].active = true; //add active functionality
            showDetails(index);
            showList(); //add active functionality
        })        
    }
});