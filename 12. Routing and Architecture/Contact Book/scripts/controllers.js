handlers.contacts = function (ctx) {
    console.log('Show contacts list');
    $.get('data.json')
        .then(data => ctx.contacts = data);

    ctx.loadPartials({
        header: './templates/common/header.hbr',
        footer: './templates/common/footer.hbr',
        contact: './templates/common/contact.hbr',
        contact_list: './templates/common/contactList.hbr',
        contact_details: './templates/common/details.hbr'
    }).then(function () {
        ctx.partials = this.partials;
        ctx.partial('./templates/contacts.hbr');
    });
    // this.bind();
    // $('.contact').click(function () {
    //     console.log('click');
    //     console.log($(this).attr('date-id'));
    // });
};