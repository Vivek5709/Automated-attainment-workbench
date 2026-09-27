const courseOutcomeService = require("../services/courseOutcome.service");


const getCourseOutcomes = async (req, res, next) => {
    try {
        const courseOutcomes = await courseOutcomeService.getAllCourseOutcomes();
        res.status(200).json({ success: true, data: courseOutcomes });
    } catch (error) {
        next(error);
    }
};

const createCourseOutcome = async (req, res, next) => {
    try {
        const { code, statement, subjectId } = req.body;

        if (!code || !statement || !subjectId) {
            return res.status(400).json({
                success: false,
                message: "code, statement, and subjectId are required"
            });
        }

        const courseOutcome = await courseOutcomeService.createCourseOutcome(
            code, statement, subjectId
        );
        res.status(201).json({ success: true, data: courseOutcome });
    } catch (error) {
        next(error);
    }
};

const updateCourseOutcome = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { code, statement, subjectId } = req.body;

        if (!code || !statement || !subjectId) {
            return res.status(400).json({
                success: false,
                message: "code, statement, and subjectId are required"
            });
        }

        const courseOutcome = await courseOutcomeService.updateCourseOutcome(
            id, code, statement, subjectId
        );
        res.status(200).json({ success: true, data: courseOutcome });
    } catch (error) {
        next(error);
    }
};

const deleteCourseOutcome = async (req, res, next) => {
    try {
        const { id } = req.params;
        await courseOutcomeService.deleteCourseOutcome(id);
        res.status(200).json({ success: true, message: "Course outcome deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const getCourseOutcomesBySubject = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const cos = await courseOutcomeService.getCourseOutcomesBySubject(subjectId);
        res.status(200).json({ success: true, data: cos });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCourseOutcomes,
    getCourseOutcomesBySubject,
    createCourseOutcome,
    updateCourseOutcome,
    deleteCourseOutcome
};