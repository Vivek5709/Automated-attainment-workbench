const coPoMappingService = require("../services/coPoMapping.service");

const getMappings = async (req, res, next) => {
    try {
        const mappings = await coPoMappingService.getAllMappings();
        res.status(200).json({ success: true, data: mappings });
    } catch (error) {
        next(error);
    }
};

const createMapping = async (req, res, next) => {
    try {
        const { coId, poId, psoId, level, subjectId } = req.body;

        // Required fields
        if (!coId || !subjectId) {
            return res.status(400).json({
                success: false,
                message: "coId and subjectId are required"
            });
        }

        // Must target PO or PSO (not both, not neither)
        if (!poId && !psoId) {
            return res.status(400).json({
                success: false,
                message: "Either poId or psoId must be provided"
            });
        }
        if (poId && psoId) {
            return res.status(400).json({
                success: false,
                message: "Provide either poId or psoId, not both"
            });
        }

        // Level validation: must be 0, 1, 2, or 3
        if (level === undefined || level === null || level === "") {
            return res.status(400).json({
                success: false,
                message: "level is required"
            });
        }
        const levelNum = Number(level);
        if (![0, 1, 2, 3].includes(levelNum)) {
            return res.status(400).json({
                success: false,
                message: "level must be 0, 1, 2, or 3"
            });
        }

        const mapping = await coPoMappingService.createMapping(
            coId, poId, psoId, level, subjectId
        );
        res.status(201).json({ success: true, data: mapping });
    } catch (error) {
        next(error);
    }
};

const updateMapping = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { coId, poId, psoId, level, subjectId } = req.body;

        if (!coId || !subjectId) {
            return res.status(400).json({
                success: false,
                message: "coId and subjectId are required"
            });
        }

        if (!poId && !psoId) {
            return res.status(400).json({
                success: false,
                message: "Either poId or psoId must be provided"
            });
        }
        if (poId && psoId) {
            return res.status(400).json({
                success: false,
                message: "Provide either poId or psoId, not both"
            });
        }

        if (level === undefined || level === null || level === "") {
            return res.status(400).json({
                success: false,
                message: "level is required"
            });
        }
        const levelNum = Number(level);
        if (![0, 1, 2, 3].includes(levelNum)) {
            return res.status(400).json({
                success: false,
                message: "level must be 0, 1, 2, or 3"
            });
        }

        const mapping = await coPoMappingService.updateMapping(
            id, coId, poId, psoId, level, subjectId
        );
        res.status(200).json({ success: true, data: mapping });
    } catch (error) {
        next(error);
    }
};

const deleteMapping = async (req, res, next) => {
    try {
        const { id } = req.params;
        await coPoMappingService.deleteMapping(id);
        res.status(200).json({ success: true, message: "CO-PO mapping deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const getMappingsBySubject = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const mappings = await coPoMappingService.getMappingsBySubject(subjectId);
        res.status(200).json({ success: true, data: mappings });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMappings,
    getMappingsBySubject,
    createMapping,
    updateMapping,
    deleteMapping
};