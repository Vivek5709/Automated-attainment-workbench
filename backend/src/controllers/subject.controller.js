const subjectService = require("../services/subject.service");

const getSubjects = async (req, res, next) => {
    try {
        const subjects = await subjectService.getAllSubjects();
        res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        next(error);
    }
};

const getSubjectById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const subject = await subjectService.getSubjectById(id);
        res.status(200).json({ success: true, data: subject });
    } catch (error) {
        next(error);
    }
};

const createSubject = async (req, res, next) => {
    try {
        const { code, name, semester, academicYear, teacherId, departmentId } = req.body;

        if (!code || !name || !semester || !academicYear || !teacherId || !departmentId) {
            return res.status(400).json({
                success: false,
                message: "code, name, semester, academicYear, teacherId, and departmentId are required"
            });
        }

        if (!Number.isInteger(Number(semester)) || Number(semester) < 1 || Number(semester) > 8) {
            return res.status(400).json({
                success: false,
                message: "semester must be an integer between 1 and 8"
            });
        }

        const subject = await subjectService.createSubject(
            code, name, semester, academicYear, teacherId, departmentId
        );
        res.status(201).json({ success: true, data: subject });
    } catch (error) {
        next(error);
    }
};

const updateSubject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { code, name, semester, academicYear, teacherId, departmentId } = req.body;

        if (!code || !name || !semester || !academicYear || !teacherId || !departmentId) {
            return res.status(400).json({
                success: false,
                message: "code, name, semester, academicYear, teacherId, and departmentId are required"
            });
        }

        if (!Number.isInteger(Number(semester)) || Number(semester) < 1 || Number(semester) > 8) {
            return res.status(400).json({
                success: false,
                message: "semester must be an integer between 1 and 8"
            });
        }

        const subject = await subjectService.updateSubject(
            id, code, name, semester, academicYear, teacherId, departmentId
        );
        res.status(200).json({ success: true, data: subject });
    } catch (error) {
        next(error);
    }
};

const deleteSubject = async (req, res, next) => {
    try {
        const { id } = req.params;
        await subjectService.deleteSubject(id);
        res.status(200).json({ success: true, message: "Subject deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
};