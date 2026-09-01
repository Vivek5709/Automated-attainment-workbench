const express = require("express");

const router = express.Router();

const programSpecificOutcomeController = require("../controllers/programSpecificOutcome.controller");

router.get("/", programSpecificOutcomeController.getProgramSpecificOutcomes);

router.post("/", programSpecificOutcomeController.createProgramSpecificOutcome);

router.put("/:id", programSpecificOutcomeController.updateProgramSpecificOutcome);

router.delete("/:id", programSpecificOutcomeController.deleteProgramSpecificOutcome);

module.exports = router;