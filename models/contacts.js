const path = require("path");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const Contact = require("./Contact");
const { nextTick } = require("process");
const { result } = require("@hapi/joi/lib/base");

const listContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().lean();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.contactId }).lean();
    if (contact) {
      res.json(contact);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    await Contact.deleteOne({ _id: contactId });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const addContact = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  try {
    const result = await Contact.create({ name, email, phone, favorite });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone, favorite } = req.body;

  try {
    const contactData = { name, email, phone, favorite };
    const result = await Contact.findOneAndUpdate(
      { _id: contactId },
      contactData,
      { new: true, upsert: true, runValidators: true, strict: "throw" }
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { favorite },
      { new: true, runValidators: true, strict: "throw" }
    );
    if (favorite == undefined) {
      res.status(400).send();
    }
    if (!result) {
      next();
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
