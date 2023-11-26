import Contact from "../../models/Contact.js";

export const updateStatusContact = async (req, res, next) => {
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
