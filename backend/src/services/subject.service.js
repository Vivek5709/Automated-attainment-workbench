const prisma = require("../config/prisma");

const getAllSubjects = async () => {
    return await prisma.subject.findMany({
        orderBy: { id: "asc" },
        include: {
            teacher: { select: { id: true, name: true, email: true } },
            department: { select: { id: true, name: true, code: true } }
        }
    });
};

/**
 * Get a single subject with teacher, department, COs, and mappings.
 */
const getSubjectById = async (id) => {
    const subject = await prisma.subject.findUnique({
        where: { id: Number(id) },
        include: {
            teacher: { select: { id: true, name: true, email: true } },
            department: { select: { id: true, name: true, code: true } },
            cos: { orderBy: { code: "asc" } },
            coPoMappings: {
                include: {
                    co: true,
                    po: true,
                    pso: true
                }
            }
        }
    });

    if (!subject) {
        const err = new Error(`Subject with id ${id} not found`);
        err.statusCode = 404;
        throw err;
    }

    return subject;
};

const createSubject = async (code, name, semester, academicYear, teacherId, departmentId) => {
    return await prisma.subject.create({
        data: {
            code,
            name,
            semester: Number(semester),
            academicYear,
            teacherId: Number(teacherId),
            departmentId: Number(departmentId)
        }
    });
};

const updateSubject = async (id, code, name, semester, academicYear, teacherId, departmentId) => {
    return await prisma.subject.update({
        where: { id: Number(id) },
        data: {
            code,
            name,
            semester: Number(semester),
            academicYear,
            teacherId: Number(teacherId),
            departmentId: Number(departmentId)
        }
    });
};

const deleteSubject = async (id) => {
    return await prisma.subject.delete({
        where: { id: Number(id) }
    });
};

module.exports = {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
};