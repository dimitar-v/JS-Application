$(() => {
   const main = $('#main');

   getTemplate();

   let contacts = [
    {firstName: "Ivan", lastName: "Ivanov", phone: "0888 123 456", email: "i.ivanov@gmail.com"},
    {firstName: "Maria", lastName: "Petrova", phone: "0899 987 654", email: "mar4eto@abv.bg"},
    {firstName: "Jordan", lastName: "Kirov", phone: "0988 456 789", email: "jordk@gmail.com"}
   ];

   async function getTemplate() {
       let template = await $.get('contact.html');
       for (const contact of contacts) {
           main[0].innerHTML += parse(template, contact);
       }
   }

   function parse(htmlAsString, context) {
       return htmlAsString.replace(/{{\s*(\w+)\s*}}/g, (m, g1) => {
           if (context.hasOwnProperty(g1))
               return context[g1];
           else
               return m;
       })
   }
});