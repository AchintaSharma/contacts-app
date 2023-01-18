const Contact = require('../models/contact.model');

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.status(200).send(contacts);
  } catch (err) {
    console.log("Error while searching contacts: ", err.message);
    return res.status(500).send({
      message: "Some internal server error occured while searching for all products"
    })
  }
}

exports.addContact = async (req, res) => {
  const contactObj = {
    _id: req.body._id,
    fname: req.body.fname,
    lname: req.body.lname,
    phone: req.body.phone
  }

  try {
    const contact = await Contact.create(contactObj);
    res.status(201).send(contact);

  } catch (err) {
    console.log("Error while creating contact: ", err.message);
    return res.status(500).send({
      message: "Some internal server error occured while creating the contact"
    })
  }
}

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate({ _id: req.params._id }, {});

    if (!contact) {
      return res.status(404).send({
        message: "No Contact found for ID - " + req.params._id
      });
    } else {
      contact.fname = req.body.fname ?? contact.fname;
      contact.lname = req.body.lname ?? contact.lname;
      contact.phone = req.body.phone ?? contact.phone;

      const updatedContact = await contact.save();

      res.status(200).send(updatedContact);
    }

  } catch (err) {
    console.log("Error while updating contact: ", err.message);
    return res.status(500).send({
      message: "Some internal server error occured while updating the contact"
    })
  }
}

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params._id });
    if (!contact) {
      return res.status(404).send({
        message: `No Contact found for ID - ${req.params._id}`
      })
    }
    await contact.remove();

    res.status(200).send({
      message: `Contact with ID - ${req.params._id} deleted successfully.`
    });
  } catch (err) {
    console.log("Error while deleting contact: ", err.message);
    return res.status(500).send({
      message: "Some internal server error occured while deleting the contact"
    })
  }
}