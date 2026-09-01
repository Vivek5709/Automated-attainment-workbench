const express = require("express");
const router = express.Router();
const courseOutcomeController = require("../controllers/courseOutcome.controller");

router.get("/", courseOutcomeController.getCourseOutcomes);
router.post("/", courseOutcomeController.createCourseOutcome);

// Convenience: COs for a subject
router.get("/by-subject/:subjectId", courseOutcomeController.getCourseOutcomesBySubject);

router.put("/:id", courseOutcomeController.updateCourseOutcome);
router.delete("/:id", courseOutcomeController.deleteCourseOutcome);

module.exports = router;