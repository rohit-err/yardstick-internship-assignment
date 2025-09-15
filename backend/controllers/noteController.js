const Note = require("../models/note")
const Tenant = require("../models/tenant")



const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required." });
    }

    const tenantId = req.user.tenantId;


    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }


    if (tenant.plan === 'free' && tenant.freeNotesUsed >= 3) {
      return res.status(403).json({
        message: "Free plan limit reached. You can create maximum 3 notes. Upgrade to Pro for unlimited notes."
      });
    }

    const newNote = new Note({
      title,
      content,
      tenantId,
      userId: req.user.userId,
    });

    await newNote.save();


    if (tenant.plan === 'free') {
      tenant.freeNotesUsed += 1;
      await tenant.save();
    }

    return res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};



const getNotes = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const notes = await Note.find({ tenantId }).sort({ createdAt: -1 });
    return res.status(200).json(notes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
const singleNote = async (req, res) => {
  try {
    const noteData = req.note;
    return res.status(200).json(noteData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


const editNote = async (req, res) => {
  try {
    const updates = req.body;


    if (req.user.role === "member" && req.note.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied: Not your note" });
    }

    const updatedNote = await Note.findByIdAndUpdate(req.note._id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updatedNote);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
const deleteNote = async (req, res) => {
  try {

    if (
      req.user.role === "member" &&
      req.note.userId.toString() !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ message: "Access denied: Not your note" });
    }

    const deleteRes = await Note.findByIdAndDelete(req.note._id);

    if (!deleteRes) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};





module.exports = { createNote, getNotes, singleNote, editNote, deleteNote };
