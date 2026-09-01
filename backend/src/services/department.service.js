const prisma = require("../config/prisma");

const getAllDepartments = async () => {
    return await prisma.department.findMany({
        orderBy: {
            id: "asc"
        }
    });
};

const createDepartment = async (name, code) => {
    return await prisma.department.create({
        data: {
            name,
            code
        }
    });
};

const updateDepartment = async (id, name, code) => {
    return await prisma.department.update({
        where: {
            id: Number(id)
        },
        data: {
            name,
            code
        }
    });
};

const deleteDepartment = async (id) => {
    return await prisma.department.delete({
        where: {
            id: Number(id)
        }
    });
};

module.exports = {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
};