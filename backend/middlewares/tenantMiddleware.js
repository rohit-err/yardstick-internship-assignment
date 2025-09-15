const Note = require("../models/note");

const tenantCheck = async (req, res, next) => {
  try {
    const noteId = req.params.id;

    if (!noteId) {
      return next();
    }


    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }


    if (note.tenantId.toString() !== req.user.tenantId._id) {
      return res.status(403).json({ message: "Access denied: Not your tenant's note" });
    }


    req.note = note;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = tenantCheck;
