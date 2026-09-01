const prisma = require("../config/prisma");

const getAllProgramOutcomes = async () => {
    return await prisma.programOutcome.findMany({
        orderBy: {
            id: "asc"
        }
    });
};

const createProgramOutcome = async (code, statement) => {
    return await prisma.programOutcome.create({
        data: {
            code,
            statement
        }
    });
};

const updateProgramOutcome = async (id, code, statement) => {
    return await prisma.programOutcome.update({
        where: {
            id: Number(id)
        },
        data: {
            code,
            statement
        }
    });
};

const deleteProgramOutcome = async (id) => {
    return await prisma.programOutcome.delete({
        where: {
            id: Number(id)
        }
    });
};

module.exports = {
    getAllProgramOutcomes,
    createProgramOutcome,
    updateProgramOutcome,
    deleteProgramOutcome
};