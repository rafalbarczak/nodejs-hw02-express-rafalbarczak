const path = require("path");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    throw new Error("Unable to read contacts data");
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const [filteredContact] = contacts.filter(
      (contact) => contact.id === contactId
    );
    if (!filteredContact) {
      const notFoundError = new Error("Contact not found");
      notFoundError.status = 404;
      throw notFoundError;
    }
    return filteredContact;
  } catch (error) {
    throw new Error("Unable to retrieve contact");
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (contactIndex === -1) {
      const notFoundError = new Error("Contact not found");
      notFoundError.status = 404;
      throw notFoundError;
    }
    const newContacts = contacts.filter((contact) => contact.id !== contactId);

    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return "Contact deleted successfully";
  } catch (error) {
    if (error.status === 404) {
      throw error;
    } else {
      throw new Error("Unable to delete contact");
    }
  }
};

const addContact = async (body) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const newContact = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      phone: body.phone,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return newContact;
  } catch (error) {
    throw new Error("Unable to create contact");
  }
};

const updateContact = async (contactId, body) => {
  let newContact = null;

  try {
    const { name, email, phone } = body;
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const filteredContact = contacts.find(
      (contact) => contact.id === contactId
    );
    if (filteredContact) {
      filteredContact.name = name;
      filteredContact.email = email;
      filteredContact.phone = phone;
    } else {
      newContact = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        phone: body.phone,
      };
      contacts.push(newContact);
    }

    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return newContact
      ? `Contact added successfully, new contact's id: ${newContact.id}`
      : "Contact updated succesfully";
  } catch (error) {
    throw new Error("Unable to update or create co]ntact");
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
