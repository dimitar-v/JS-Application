$(() => {
    const main = $('#main');

    let context = {
        contacts: [
            {firstName: "Ivan", lastName: "Ivanov", phone: "0888 123 456", email: "i.ivanov@gmail.com"},
            {firstName: "Maria", lastName: "Petrova", phone: "0899 987 654", email: "mar4eto@abv.bg"},
            {firstName: "Jordan", lastName: "Kirov", phone: "0988 456 789", email: "jordk@gmail.com"}
        ]
    };

    loadTemplates();

   async function loadTemplates() {
       const [contactSource, listSource] =
           await Promise.all([$.get('04_contact.html'),$.get('04_contactsList.html')]);

       Handlebars.registerPartial('contact', contactSource);
       let listTemplate = Handlebars.compile(listSource);

       main.html(listTemplate(context))
   }
});