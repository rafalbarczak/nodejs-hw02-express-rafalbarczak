import Contact from "../../models/Contact.js";

export const updateContact = async (req, res, next) => {
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
