const express = require("express");

const router = express.Router();

const programOutcomeController = require("../controllers/programOutcome.controller");

router.get("/", programOutcomeController.getProgramOutcomes);

router.post("/", programOutcomeController.createProgramOutcome);

router.put("/:id", programOutcomeController.updateProgramOutcome);

router.delete("/:id", programOutcomeController.deleteProgramOutcome);

module.exports = router;