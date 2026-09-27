const programOutcomeService = require("../services/programOutcome.service");

const getProgramOutcomes = async (req, res, next) => {
    try {
        const programOutcomes = await programOutcomeService.getAllProgramOutcomes();
        res.status(200).json({ success: true, data: programOutcomes });
    } catch (error) {
        next(error);
    }
};

const createProgramOutcome = async (req, res, next) => {
    try {
        const { code, statement } = req.body;

        if (!code || !statement) {
            return res.status(400).json({
                success: false,
                message: "code and statement are required"
            });
        }

        const programOutcome = await programOutcomeService.createProgramOutcome(code, statement);
        res.status(201).json({ success: true, data: programOutcome });
    } catch (error) {
        next(error);
    }
};

const updateProgramOutcome = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { code, statement } = req.body;

        if (!code || !statement) {
            return res.status(400).json({
                success: false,
                message: "code and statement are required"
            });
        }

        const programOutcome = await programOutcomeService.updateProgramOutcome(id, code, statement);
        res.status(200).json({ success: true, data: programOutcome });
    } catch (error) {
        next(error);
    }
};

const deleteProgramOutcome = async (req, res, next) => {
    try {
        const { id } = req.params;
        await programOutcomeService.deleteProgramOutcome(id);
        res.status(200).json({ success: true, message: "Program outcome deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProgramOutcomes,
    createProgramOutcome,
    updateProgramOutcome,
    deleteProgramOutcome
};