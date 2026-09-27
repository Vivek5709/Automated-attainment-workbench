const express = require("express");
const router = express.Router();
const coPoMappingController = require("../controllers/coPoMapping.controller");

router.get("/", coPoMappingController.getMappings);
router.post("/", coPoMappingController.createMapping);

// Convenience: mappings for a subject
router.get("/by-subject/:subjectId", coPoMappingController.getMappingsBySubject);

router.put("/:id", coPoMappingController.updateMapping);
router.delete("/:id", coPoMappingController.deleteMapping);

module.exports = router;