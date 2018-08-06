handlers.contacts = function (ctx, id) {
    console.log('Show contacts list');
    $.get('data.json')
        .then(data => ctx.contacts = data);
    if (id){
        ctx.firstName = ctx.contacts[id].firstName;
        ctx.lastName = ctx.contacts[id].lastName;
        ctx.phone = ctx.contacts[id].phone;
        ctx.email = ctx.contacts[id].email;
    }
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
};