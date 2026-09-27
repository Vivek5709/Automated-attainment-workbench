const express = require("express");
const router = express.Router();
const attainmentController = require("../controllers/attainment.controller");

// CO Attainment
router.get("/co/:subjectId", attainmentController.getCoAttainment);
router.get("/co/:subjectId/:coId", attainmentController.getSingleCoAttainment);

// PO Attainment
router.get("/po/:subjectId", attainmentController.getPoAttainment);

// PSO Attainment
router.get("/pso/:subjectId", attainmentController.getPsoAttainment);

// Full CO-PO / CO-PSO Matrix
router.get("/matrix/:subjectId", attainmentController.getMatrix);

module.exports = router;
