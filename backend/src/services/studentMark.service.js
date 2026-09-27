const prisma = require("../config/prisma");

const getAllStudentMarks = async () => {
    return await prisma.studentMark.findMany({
        orderBy: { id: "asc" },
        include: {
            subject: { select: { id: true, code: true, name: true } },
            co: { select: { id: true, code: true, statement: true } }
        }
    });
};

/**
 * Verify that the CO belongs to the given subject (CO-Subject consistency).
 */
const verifyCoBelongsToSubject = async (coId, subjectId) => {
    const co = await prisma.courseOutcome.findFirst({
        where: {
            id: Number(coId),
            subjectId: Number(subjectId)
        }
    });

    if (!co) {
        const err = new Error(
            `CO id ${coId} does not belong to subject id ${subjectId}`
        );
        err.statusCode = 400;
        throw err;
    }
};

/**
 * Get all marks for a subject.
 */
const getMarksBySubject = async (subjectId) => {
    return await prisma.studentMark.findMany({
        where: { subjectId: Number(subjectId) },
        orderBy: [{ studentRollNo: "asc" }, { coId: "asc" }],
        include: {
            co: { select: { id: true, code: true, statement: true } }
        }
    });
};

/**
 * Get all marks for a specific CO.
 */
const getMarksByCo = async (coId) => {
    return await prisma.studentMark.findMany({
        where: { coId: Number(coId) },
        orderBy: [{ studentRollNo: "asc" }],
        include: {
            subject: { select: { id: true, code: true, name: true } }
        }
    });
};

const createStudentMark = async (studentRollNo, marks, subjectId, coId) => {
    await verifyCoBelongsToSubject(coId, subjectId);

    return await prisma.studentMark.create({
        data: {
            studentRollNo,
            marks: Number(marks),
            subjectId: Number(subjectId),
            coId: Number(coId)
        }
    });
};

const updateStudentMark = async (id, studentRollNo, marks, subjectId, coId) => {
    await verifyCoBelongsToSubject(coId, subjectId);

    return await prisma.studentMark.update({
        where: { id: Number(id) },
        data: {
            studentRollNo,
            marks: Number(marks),
            subjectId: Number(subjectId),
            coId: Number(coId)
        }
    });
};

const deleteStudentMark = async (id) => {
    return await prisma.studentMark.delete({
        where: { id: Number(id) }
    });
};

module.exports = {
    getAllStudentMarks,
    getMarksBySubject,
    getMarksByCo,
    createStudentMark,
    updateStudentMark,
    deleteStudentMark
};