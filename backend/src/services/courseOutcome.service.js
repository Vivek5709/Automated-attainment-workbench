const prisma = require("../config/prisma");

const getAllCourseOutcomes = async () => {
    return await prisma.courseOutcome.findMany({
        orderBy: { id: "asc" },
        include: {
            subject: { select: { id: true, code: true, name: true } }
        }
    });
};

const getCourseOutcomesBySubject = async (subjectId) => {
    return await prisma.courseOutcome.findMany({
        where: { subjectId: Number(subjectId) },
        orderBy: { code: "asc" }
    });
};

const createCourseOutcome = async (code, statement, subjectId) => {
    return await prisma.courseOutcome.create({
        data: {
            code,
            statement,
            subjectId: Number(subjectId)
        }
    });
};

const updateCourseOutcome = async (id, code, statement, subjectId) => {
    return await prisma.courseOutcome.update({
        where: {
            id: Number(id)
        },
        data: {
            code,
            statement,
            subjectId: Number(subjectId)
        }
    });
};

const deleteCourseOutcome = async (id) => {
    return await prisma.courseOutcome.delete({
        where: {
            id: Number(id)
        }
    });
};

module.exports = {
    getAllCourseOutcomes,
    getCourseOutcomesBySubject,
    createCourseOutcome,
    updateCourseOutcome,
    deleteCourseOutcome
};