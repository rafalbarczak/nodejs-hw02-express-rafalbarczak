import Contact from "../../models/Contact.js";

export const listContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().lean();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};
