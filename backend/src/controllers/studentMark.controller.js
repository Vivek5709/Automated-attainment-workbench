const studentMarkService = require("../services/studentMark.service");


const getStudentMarks = async (req, res, next) => {
    try {
        const studentMarks = await studentMarkService.getAllStudentMarks();
        res.status(200).json({ success: true, data: studentMarks });
    } catch (error) {
        next(error);
    }
};

const createStudentMark = async (req, res, next) => {
    try {
        const { studentRollNo, marks, subjectId, coId } = req.body;

        if (!studentRollNo || marks === undefined || marks === null || !subjectId || !coId) {
            return res.status(400).json({
                success: false,
                message: "studentRollNo, marks, subjectId, and coId are required"
            });
        }

        const marksNum = Number(marks);
        if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
            return res.status(400).json({
                success: false,
                message: "marks must be a number between 0 and 100"
            });
        }

        const studentMark = await studentMarkService.createStudentMark(
            studentRollNo, marks, subjectId, coId
        );
        res.status(201).json({ success: true, data: studentMark });
    } catch (error) {
        next(error);
    }
};

const updateStudentMark = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { studentRollNo, marks, subjectId, coId } = req.body;

        if (!studentRollNo || marks === undefined || marks === null || !subjectId || !coId) {
            return res.status(400).json({
                success: false,
                message: "studentRollNo, marks, subjectId, and coId are required"
            });
        }

        const marksNum = Number(marks);
        if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
            return res.status(400).json({
                success: false,
                message: "marks must be a number between 0 and 100"
            });
        }

        const studentMark = await studentMarkService.updateStudentMark(
            id, studentRollNo, marks, subjectId, coId
        );
        res.status(200).json({ success: true, data: studentMark });
    } catch (error) {
        next(error);
    }
};

const deleteStudentMark = async (req, res, next) => {
    try {
        const { id } = req.params;
        await studentMarkService.deleteStudentMark(id);
        res.status(200).json({ success: true, message: "Student mark deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const getMarksBySubject = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const marks = await studentMarkService.getMarksBySubject(subjectId);
        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        next(error);
    }
};

const getMarksByCo = async (req, res, next) => {
    try {
        const { coId } = req.params;
        const marks = await studentMarkService.getMarksByCo(coId);
        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStudentMarks,
    getMarksBySubject,
    getMarksByCo,
    createStudentMark,
    updateStudentMark,
    deleteStudentMark
};