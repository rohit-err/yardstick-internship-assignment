const express = require("express");
const noteRoutes = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const checkPlan = require("../middlewares/subscriptionMiddleware");
const tenantCheck = require("../middlewares/tenantMiddleware");
const {createNote,getNotes,singleNote,editNote,deleteNote,} = require("../controllers/noteController");


noteRoutes.post("/", verifyToken, checkPlan, createNote);
noteRoutes.get("/", verifyToken, getNotes);
noteRoutes.get("/:id", verifyToken, tenantCheck, singleNote);
noteRoutes.put("/:id", verifyToken, tenantCheck, editNote);
noteRoutes.delete("/:id", verifyToken, tenantCheck, deleteNote);

module.exports = noteRoutes;
