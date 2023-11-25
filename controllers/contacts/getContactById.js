import Contact from "../../models/Contact.js";

export const getContactById = async (req, res, next) => {
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
