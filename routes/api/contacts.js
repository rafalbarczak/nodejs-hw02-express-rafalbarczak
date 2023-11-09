const express = require("express");
const contacts = require("../../models/contacts.js");
const Joi = require("@hapi/joi");

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contactList = await contacts.listContacts();
    res.json(contactList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.getContactById(contactId);
    res.json(contact);
  } catch (error) {
    if (error.status === 404) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const validationResult = contactSchema.validate({ name, email, phone });

  if (validationResult.error) {
    return res.status(400).json({ message: "missing required name - field" });
  }
  try {
    const contact = await contacts.addContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const message = await contacts.removeContact(contactId);
    res.json(message);
  } catch (error) {
    if (error.status === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const validationResult = contactSchema.validate({ name, email, phone });

  if (validationResult.error) {
    return res.status(400).json({ message: "missing required name - field" });
  }
  try {
    const { contactId } = req.params;
    const message = await contacts.updateContact(contactId, req.body);
    const statusCode = message.includes("updated") ? 200 : 201;

    res.status(statusCode).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
