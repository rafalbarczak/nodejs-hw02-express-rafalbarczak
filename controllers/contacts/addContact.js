import Contact from "../../models/Contact.js";

export const addContact = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  try {
    const result = await Contact.create({ name, email, phone, favorite });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
