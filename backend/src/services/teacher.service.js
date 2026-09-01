const prisma = require("../config/prisma");

const getAllTeachers = async () => {
    return await prisma.teacher.findMany({
        orderBy: {
            id: "asc"
        }
    });
};

const createTeacher = async (name, email) => {
    return await prisma.teacher.create({
        data: {
            name,
            email
        }
    });
};

const updateTeacher = async (id, name, email) => {
    return await prisma.teacher.update({
        where: {
            id: Number(id)
        },
        data: {
            name,
            email
        }
    });
};

const deleteTeacher = async (id) => {
    return await prisma.teacher.delete({
        where: {
            id: Number(id)
        }
    });
};

module.exports = {
    getAllTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher
};