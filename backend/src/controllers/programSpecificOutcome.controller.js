const programSpecificOutcomeService = require("../services/programSpecificOutcome.service");

const getProgramSpecificOutcomes = async (req, res, next) => {
    try {
        const psos = await programSpecificOutcomeService.getAllProgramSpecificOutcomes();
        res.status(200).json({ success: true, data: psos });
    } catch (error) {
        next(error);
    }
};

const createProgramSpecificOutcome = async (req, res, next) => {
    try {
        const { code, statement } = req.body;

        if (!code || !statement) {
            return res.status(400).json({
                success: false,
                message: "code and statement are required"
            });
        }

        const pso = await programSpecificOutcomeService.createProgramSpecificOutcome(code, statement);
        res.status(201).json({ success: true, data: pso });
    } catch (error) {
        next(error);
    }
};

const updateProgramSpecificOutcome = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { code, statement } = req.body;

        if (!code || !statement) {
            return res.status(400).json({
                success: false,
                message: "code and statement are required"
            });
        }

        const pso = await programSpecificOutcomeService.updateProgramSpecificOutcome(id, code, statement);
        res.status(200).json({ success: true, data: pso });
    } catch (error) {
        next(error);
    }
};

const deleteProgramSpecificOutcome = async (req, res, next) => {
    try {
        const { id } = req.params;
        await programSpecificOutcomeService.deleteProgramSpecificOutcome(id);
        res.status(200).json({ success: true, message: "Program specific outcome deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProgramSpecificOutcomes,
    createProgramSpecificOutcome,
    updateProgramSpecificOutcome,
    deleteProgramSpecificOutcome
};