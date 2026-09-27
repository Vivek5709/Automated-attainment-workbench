const prisma = require("../config/prisma");

const getAllMappings = async () => {
    return await prisma.coPoMapping.findMany({
        orderBy: { id: "asc" },
        include: {
            co: true,
            po: true,
            pso: true
        }
    });
};

const getMappingsBySubject = async (subjectId) => {
    return await prisma.coPoMapping.findMany({
        where: { subjectId: Number(subjectId) },
        orderBy: { id: "asc" },
        include: {
            co: true,
            po: true,
            pso: true
        }
    });
};

/**
 * Check for an existing duplicate mapping before creating.
 * Since poId/psoId are nullable, we use application-level duplicate detection.
 */
const checkDuplicate = async (coId, poId, psoId, excludeId = null) => {
    const where = { coId: Number(coId) };

    if (poId) {
        where.poId = Number(poId);
    } else if (psoId) {
        where.psoId = Number(psoId);
    }

    const existing = await prisma.coPoMapping.findFirst({ where });

    if (existing && existing.id !== excludeId) {
        const target = poId ? `PO id ${poId}` : `PSO id ${psoId}`;
        const err = new Error(
            `A mapping for CO id ${coId} → ${target} already exists (mapping id: ${existing.id})`
        );
        err.statusCode = 409;
        throw err;
    }
};

/**
 * Verify that the CO belongs to the given subject.
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

const createMapping = async (coId, poId, psoId, level, subjectId) => {
    await verifyCoBelongsToSubject(coId, subjectId);
    await checkDuplicate(coId, poId, psoId);

    return await prisma.coPoMapping.create({
        data: {
            coId: Number(coId),
            poId: poId ? Number(poId) : null,
            psoId: psoId ? Number(psoId) : null,
            level: Number(level),
            subjectId: Number(subjectId)
        }
    });
};

const updateMapping = async (id, coId, poId, psoId, level, subjectId) => {
    await verifyCoBelongsToSubject(coId, subjectId);
    await checkDuplicate(coId, poId, psoId, Number(id));

    return await prisma.coPoMapping.update({
        where: { id: Number(id) },
        data: {
            coId: Number(coId),
            poId: poId ? Number(poId) : null,
            psoId: psoId ? Number(psoId) : null,
            level: Number(level),
            subjectId: Number(subjectId)
        }
    });
};

const deleteMapping = async (id) => {
    return await prisma.coPoMapping.delete({
        where: { id: Number(id) }
    });
};

module.exports = {
    getAllMappings,
    getMappingsBySubject,
    createMapping,
    updateMapping,
    deleteMapping
};