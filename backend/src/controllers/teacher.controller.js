const teacherService = require("../services/teacher.service");

const getTeachers = async (req, res, next) => {
    try {
        const teachers = await teacherService.getAllTeachers();
        res.status(200).json({ success: true, data: teachers });
    } catch (error) {
        next(error);
    }
};

const createTeacher = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "name and email are required"
            });
        }

        const teacher = await teacherService.createTeacher(name, email);
        res.status(201).json({ success: true, data: teacher });
    } catch (error) {
        next(error);
    }
};

const updateTeacher = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "name and email are required"
            });
        }

        const teacher = await teacherService.updateTeacher(id, name, email);
        res.status(200).json({ success: true, data: teacher });
    } catch (error) {
        next(error);
    }
};

const deleteTeacher = async (req, res, next) => {
    try {
        const { id } = req.params;
        await teacherService.deleteTeacher(id);
        res.status(200).json({ success: true, message: "Teacher deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher
};