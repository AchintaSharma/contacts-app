const contactController = require('../controllers/contact.controller')

module.exports = (app) => {
  app.get("/contactapp/api/v1/contacts/", contactController.getAllContacts);

  app.post("/contactapp/api/v1/contacts/", contactController.addContact);

  app.put("/contactapp/api/v1/contacts/:_id", contactController.updateContact);

  app.delete("/contactapp/api/v1/contacts/:_id", contactController.deleteContact);
}


