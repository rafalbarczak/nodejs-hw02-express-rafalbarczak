import express from "express";
import { listContacts } from "../../controllers/contacts/listContacts.js";
import { getContactById } from "../../controllers/contacts/getContactById.js";
import { addContact } from "../../controllers/contacts/addContact.js";
import { updateContact } from "../../controllers/contacts/updateContact.js";
import { removeContact } from "../../controllers/contacts/removeContact.js";
import { updateStatusContact } from "../../controllers/contacts/updateStatusContact.js";

const router = express.Router();

router.get("/", listContacts);

router.get("/:contactId", getContactById);

router.post("/", addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", updateContact);

router.patch("/:contactId", updateStatusContact);

export { router };
