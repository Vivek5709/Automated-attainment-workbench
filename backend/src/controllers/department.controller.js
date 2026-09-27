const departmentService = require("../services/department.service");

const getDepartments = async (req, res, next) => {
    try {
        const departments = await departmentService.getAllDepartments();
        res.status(200).json({ success: true, data: departments });
    } catch (error) {
        next(error);
    }
};

const createDepartment = async (req, res, next) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "name and code are required"
            });
        }

        const department = await departmentService.createDepartment(name, code);
        res.status(201).json({ success: true, data: department });
    } catch (error) {
        next(error);
    }
};

const updateDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "name and code are required"
            });
        }

        const department = await departmentService.updateDepartment(id, name, code);
        res.status(200).json({ success: true, data: department });
    } catch (error) {
        next(error);
    }
};

const deleteDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        await departmentService.deleteDepartment(id);
        res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
};