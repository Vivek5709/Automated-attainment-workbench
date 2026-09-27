const express = require("express");
const router = express.Router();
const studentMarkController = require("../controllers/studentMark.controller");

// General CRUD
router.get("/", studentMarkController.getStudentMarks);
router.post("/", studentMarkController.createStudentMark);
router.put("/:id", studentMarkController.updateStudentMark);
router.delete("/:id", studentMarkController.deleteStudentMark);

// Convenience queries
router.get("/by-subject/:subjectId", studentMarkController.getMarksBySubject);
router.get("/by-co/:coId", studentMarkController.getMarksByCo);

module.exports = router;