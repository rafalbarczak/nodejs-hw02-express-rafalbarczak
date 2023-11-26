import Contact from "../../models/Contact.js";

export const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    await Contact.deleteOne({ _id: contactId });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
