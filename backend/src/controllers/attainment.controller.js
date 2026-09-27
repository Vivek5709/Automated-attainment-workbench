const attainmentService = require("../services/attainment.service");

// ─── CO Attainment ────────────────────────────────────────────────────────────

const getCoAttainment = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const threshold = req.query.threshold
            ? Number(req.query.threshold)
            : undefined;

        if (threshold !== undefined && (isNaN(threshold) || threshold < 0 || threshold > 100)) {
            return res.status(400).json({
                success: false,
                message: "threshold must be a number between 0 and 100"
            });
        }

        const result = await attainmentService.calculateCoAttainment(
            subjectId,
            threshold
        );

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

const getSingleCoAttainment = async (req, res, next) => {
    try {
        const { subjectId, coId } = req.params;
        const threshold = req.query.threshold
            ? Number(req.query.threshold)
            : undefined;

        if (threshold !== undefined && (isNaN(threshold) || threshold < 0 || threshold > 100)) {
            return res.status(400).json({
                success: false,
                message: "threshold must be a number between 0 and 100"
            });
        }

        const result = await attainmentService.calculateSingleCoAttainment(
            subjectId,
            coId,
            threshold
        );

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

// ─── PO Attainment ────────────────────────────────────────────────────────────

const getPoAttainment = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const threshold = req.query.threshold
            ? Number(req.query.threshold)
            : undefined;

        if (threshold !== undefined && (isNaN(threshold) || threshold < 0 || threshold > 100)) {
            return res.status(400).json({
                success: false,
                message: "threshold must be a number between 0 and 100"
            });
        }

        const result = await attainmentService.calculatePoAttainment(
            subjectId,
            threshold
        );

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

// ─── PSO Attainment ───────────────────────────────────────────────────────────

const getPsoAttainment = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const threshold = req.query.threshold
            ? Number(req.query.threshold)
            : undefined;

        if (threshold !== undefined && (isNaN(threshold) || threshold < 0 || threshold > 100)) {
            return res.status(400).json({
                success: false,
                message: "threshold must be a number between 0 and 100"
            });
        }

        const result = await attainmentService.calculatePsoAttainment(
            subjectId,
            threshold
        );

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

// ─── CO-PO / CO-PSO Matrix ────────────────────────────────────────────────────

const getMatrix = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const threshold = req.query.threshold
            ? Number(req.query.threshold)
            : undefined;

        if (threshold !== undefined && (isNaN(threshold) || threshold < 0 || threshold > 100)) {
            return res.status(400).json({
                success: false,
                message: "threshold must be a number between 0 and 100"
            });
        }

        const result = await attainmentService.buildMatrix(
            subjectId,
            threshold
        );

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCoAttainment,
    getSingleCoAttainment,
    getPoAttainment,
    getPsoAttainment,
    getMatrix
};
