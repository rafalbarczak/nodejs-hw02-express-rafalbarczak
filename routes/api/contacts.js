const express = require("express");
const contacts = require("../../models/contacts.js");

const router = express.Router();

router.get("/", contacts.listContacts);

router.get("/:contactId", contacts.getContactById);

router.post("/", contacts.addContact);

router.delete("/:contactId", contacts.removeContact);

router.put("/:contactId", contacts.updateContact);

router.patch("/:contactId", contacts.updateStatusContact);

module.exports = router;
