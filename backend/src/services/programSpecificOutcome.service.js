const prisma = require("../config/prisma");

const getAllProgramSpecificOutcomes = async () => {
    return await prisma.programSpecificOutcome.findMany({
        orderBy: {
            id: "asc"
        }
    });
};

const createProgramSpecificOutcome = async (code, statement) => {
    return await prisma.programSpecificOutcome.create({
        data: {
            code,
            statement
        }
    });
};

const updateProgramSpecificOutcome = async (id, code, statement) => {
    return await prisma.programSpecificOutcome.update({
        where: {
            id: Number(id)
        },
        data: {
            code,
            statement
        }
    });
};

const deleteProgramSpecificOutcome = async (id) => {
    return await prisma.programSpecificOutcome.delete({
        where: {
            id: Number(id)
        }
    });
};

module.exports = {
    getAllProgramSpecificOutcomes,
    createProgramSpecificOutcome,
    updateProgramSpecificOutcome,
    deleteProgramSpecificOutcome
};