const prisma = require("../config/prisma");

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_THRESHOLD = 60; // marks out of 100
const DEFAULT_MAX_MARKS = 100;

// ─── CO Attainment ────────────────────────────────────────────────────────────

/**
 * Calculate CO-wise attainment for a subject.
 *
 * Formula:
 *   CO Attainment (%) = (students who scored >= threshold / total students) × 100
 *
 * @param {number} subjectId
 * @param {number} [threshold=60]
 * @returns {Promise<Object>}
 */
const calculateCoAttainment = async (subjectId, threshold = DEFAULT_THRESHOLD) => {
    // Verify subject exists and pull COs
    const subject = await prisma.subject.findUnique({
        where: { id: Number(subjectId) },
        include: {
            cos: {
                orderBy: { code: "asc" }
            }
        }
    });

    if (!subject) {
        const err = new Error(`Subject with id ${subjectId} not found`);
        err.statusCode = 404;
        throw err;
    }

    // Fetch all student marks for this subject in one query
    const allMarks = await prisma.studentMark.findMany({
        where: { subjectId: Number(subjectId) }
    });

    // Group marks by coId
    const marksByCoId = {};
    for (const mark of allMarks) {
        if (!marksByCoId[mark.coId]) {
            marksByCoId[mark.coId] = [];
        }
        marksByCoId[mark.coId].push(mark);
    }

    const coAttainments = subject.cos.map((co) => {
        const marks = marksByCoId[co.id] || [];
        const totalStudents = marks.length;

        if (totalStudents === 0) {
            return {
                coId: co.id,
                coCode: co.code,
                coStatement: co.statement,
                totalStudents: 0,
                studentsAboveThreshold: 0,
                attainmentPercent: null
            };
        }

        const studentsAboveThreshold = marks.filter(
            (m) => m.marks >= threshold
        ).length;

        const attainmentPercent = parseFloat(
            ((studentsAboveThreshold / totalStudents) * 100).toFixed(2)
        );

        return {
            coId: co.id,
            coCode: co.code,
            coStatement: co.statement,
            totalStudents,
            studentsAboveThreshold,
            attainmentPercent
        };
    });

    return {
        subjectId: subject.id,
        subjectCode: subject.code,
        subjectName: subject.name,
        threshold,
        maxMarks: DEFAULT_MAX_MARKS,
        data: coAttainments
    };
};

/**
 * Calculate attainment for a single CO within a subject.
 *
 * @param {number} subjectId
 * @param {number} coId
 * @param {number} [threshold=60]
 */
const calculateSingleCoAttainment = async (
    subjectId,
    coId,
    threshold = DEFAULT_THRESHOLD
) => {
    const result = await calculateCoAttainment(subjectId, threshold);
    const co = result.data.find((c) => c.coId === Number(coId));

    if (!co) {
        const err = new Error(
            `CO with id ${coId} not found in subject ${subjectId}`
        );
        err.statusCode = 404;
        throw err;
    }

    return {
        subjectId: result.subjectId,
        subjectCode: result.subjectCode,
        subjectName: result.subjectName,
        threshold: result.threshold,
        maxMarks: result.maxMarks,
        data: co
    };
};

// ─── PO Attainment ────────────────────────────────────────────────────────────

/**
 * Calculate PO-wise attainment for a subject using weighted average.
 *
 * Formula:
 *   PO Attainment = Σ (CO_attainment% × mapping_level) / Σ mapping_level
 *
 * Mapping level 0 is excluded from the calculation.
 *
 * @param {number} subjectId
 * @param {number} [threshold=60]
 */
const calculatePoAttainment = async (subjectId, threshold = DEFAULT_THRESHOLD) => {
    const coResult = await calculateCoAttainment(subjectId, threshold);

    // Build a map: coId → attainmentPercent
    const coAttainmentMap = {};
    for (const co of coResult.data) {
        coAttainmentMap[co.coId] = co.attainmentPercent;
    }

    // Fetch all CO→PO mappings for this subject (level > 0 only)
    const mappings = await prisma.coPoMapping.findMany({
        where: {
            subjectId: Number(subjectId),
            poId: { not: null },
            level: { gt: 0 }
        },
        include: {
            po: true
        }
    });

    // Group by PO
    const poMap = {};
    for (const mapping of mappings) {
        const poId = mapping.poId;
        if (!poMap[poId]) {
            poMap[poId] = {
                poId: mapping.po.id,
                poCode: mapping.po.code,
                poStatement: mapping.po.statement,
                contributions: []
            };
        }
        const coAttainment = coAttainmentMap[mapping.coId];
        if (coAttainment !== null && coAttainment !== undefined) {
            poMap[poId].contributions.push({
                coId: mapping.coId,
                level: mapping.level,
                coAttainmentPercent: coAttainment
            });
        }
    }

    // Compute weighted average per PO
    const poAttainments = Object.values(poMap).map((po) => {
        if (po.contributions.length === 0) {
            return {
                poId: po.poId,
                poCode: po.poCode,
                poStatement: po.poStatement,
                attainmentPercent: null,
                contributions: []
            };
        }

        const sumWeightedAttainment = po.contributions.reduce(
            (sum, c) => sum + c.coAttainmentPercent * c.level,
            0
        );
        const sumLevels = po.contributions.reduce(
            (sum, c) => sum + c.level,
            0
        );

        const attainmentPercent =
            sumLevels > 0
                ? parseFloat((sumWeightedAttainment / sumLevels).toFixed(2))
                : null;

        return {
            poId: po.poId,
            poCode: po.poCode,
            poStatement: po.poStatement,
            attainmentPercent,
            contributions: po.contributions
        };
    });

    // Sort by PO code
    poAttainments.sort((a, b) => a.poCode.localeCompare(b.poCode));

    return {
        subjectId: coResult.subjectId,
        subjectCode: coResult.subjectCode,
        subjectName: coResult.subjectName,
        threshold,
        data: poAttainments
    };
};

// ─── PSO Attainment ───────────────────────────────────────────────────────────

/**
 * Calculate PSO-wise attainment for a subject using weighted average.
 * Same formula as PO attainment.
 *
 * @param {number} subjectId
 * @param {number} [threshold=60]
 */
const calculatePsoAttainment = async (subjectId, threshold = DEFAULT_THRESHOLD) => {
    const coResult = await calculateCoAttainment(subjectId, threshold);

    const coAttainmentMap = {};
    for (const co of coResult.data) {
        coAttainmentMap[co.coId] = co.attainmentPercent;
    }

    const mappings = await prisma.coPoMapping.findMany({
        where: {
            subjectId: Number(subjectId),
            psoId: { not: null },
            level: { gt: 0 }
        },
        include: {
            pso: true
        }
    });

    const psoMap = {};
    for (const mapping of mappings) {
        const psoId = mapping.psoId;
        if (!psoMap[psoId]) {
            psoMap[psoId] = {
                psoId: mapping.pso.id,
                psoCode: mapping.pso.code,
                psoStatement: mapping.pso.statement,
                contributions: []
            };
        }
        const coAttainment = coAttainmentMap[mapping.coId];
        if (coAttainment !== null && coAttainment !== undefined) {
            psoMap[psoId].contributions.push({
                coId: mapping.coId,
                level: mapping.level,
                coAttainmentPercent: coAttainment
            });
        }
    }

    const psoAttainments = Object.values(psoMap).map((pso) => {
        if (pso.contributions.length === 0) {
            return {
                psoId: pso.psoId,
                psoCode: pso.psoCode,
                psoStatement: pso.psoStatement,
                attainmentPercent: null,
                contributions: []
            };
        }

        const sumWeightedAttainment = pso.contributions.reduce(
            (sum, c) => sum + c.coAttainmentPercent * c.level,
            0
        );
        const sumLevels = pso.contributions.reduce(
            (sum, c) => sum + c.level,
            0
        );

        const attainmentPercent =
            sumLevels > 0
                ? parseFloat((sumWeightedAttainment / sumLevels).toFixed(2))
                : null;

        return {
            psoId: pso.psoId,
            psoCode: pso.psoCode,
            psoStatement: pso.psoStatement,
            attainmentPercent,
            contributions: pso.contributions
        };
    });

    psoAttainments.sort((a, b) => a.psoCode.localeCompare(b.psoCode));

    return {
        subjectId: coResult.subjectId,
        subjectCode: coResult.subjectCode,
        subjectName: coResult.subjectName,
        threshold,
        data: psoAttainments
    };
};

// ─── CO-PO / CO-PSO Matrix ────────────────────────────────────────────────────

/**
 * Build the full CO-PO and CO-PSO matrix for a subject.
 *
 * Returns:
 * {
 *   pos: [{ id, code }],
 *   psos: [{ id, code }],
 *   cos: [
 *     {
 *       coId, coCode, coStatement, attainmentPercent,
 *       poLevels: { [poId]: level | null },
 *       psoLevels: { [psoId]: level | null }
 *     }
 *   ],
 *   poAttainments: { [poId]: attainmentPercent | null },
 *   psoAttainments: { [psoId]: attainmentPercent | null }
 * }
 *
 * @param {number} subjectId
 * @param {number} [threshold=60]
 */
const buildMatrix = async (subjectId, threshold = DEFAULT_THRESHOLD) => {
    const [coResult, poResult, psoResult] = await Promise.all([
        calculateCoAttainment(subjectId, threshold),
        calculatePoAttainment(subjectId, threshold),
        calculatePsoAttainment(subjectId, threshold)
    ]);

    // Fetch all mappings for this subject (all levels including 0)
    const allMappings = await prisma.coPoMapping.findMany({
        where: { subjectId: Number(subjectId) },
        include: {
            po: true,
            pso: true
        }
    });

    // Collect unique POs and PSOs from mappings
    const posMap = {};
    const psosMap = {};
    for (const m of allMappings) {
        if (m.poId && m.po) {
            posMap[m.poId] = { id: m.po.id, code: m.po.code };
        }
        if (m.psoId && m.pso) {
            psosMap[m.psoId] = { id: m.pso.id, code: m.pso.code };
        }
    }

    const pos = Object.values(posMap).sort((a, b) =>
        a.code.localeCompare(b.code)
    );
    const psos = Object.values(psosMap).sort((a, b) =>
        a.code.localeCompare(b.code)
    );

    // Build quick-access: coId → { poId → level, psoId → level }
    const coPoLevelMap = {};
    const coPsoLevelMap = {};
    for (const m of allMappings) {
        if (m.poId) {
            if (!coPoLevelMap[m.coId]) coPoLevelMap[m.coId] = {};
            coPoLevelMap[m.coId][m.poId] = m.level;
        }
        if (m.psoId) {
            if (!coPsoLevelMap[m.coId]) coPsoLevelMap[m.coId] = {};
            coPsoLevelMap[m.coId][m.psoId] = m.level;
        }
    }

    // Build CO rows
    const coAttainmentMap = {};
    for (const co of coResult.data) {
        coAttainmentMap[co.coId] = co.attainmentPercent;
    }

    const coRows = coResult.data.map((co) => {
        const poLevels = {};
        for (const po of pos) {
            poLevels[po.id] =
                coPoLevelMap[co.coId]?.[po.id] !== undefined
                    ? coPoLevelMap[co.coId][po.id]
                    : null;
        }

        const psoLevels = {};
        for (const pso of psos) {
            psoLevels[pso.id] =
                coPsoLevelMap[co.coId]?.[pso.id] !== undefined
                    ? coPsoLevelMap[co.coId][pso.id]
                    : null;
        }

        return {
            coId: co.coId,
            coCode: co.coCode,
            coStatement: co.coStatement,
            totalStudents: co.totalStudents,
            studentsAboveThreshold: co.studentsAboveThreshold,
            attainmentPercent: co.attainmentPercent,
            poLevels,
            psoLevels
        };
    });

    // Build attainment footer rows
    const poAttainments = {};
    for (const po of poResult.data) {
        poAttainments[po.poId] = po.attainmentPercent;
    }

    const psoAttainments = {};
    for (const pso of psoResult.data) {
        psoAttainments[pso.psoId] = pso.attainmentPercent;
    }

    return {
        subjectId: coResult.subjectId,
        subjectCode: coResult.subjectCode,
        subjectName: coResult.subjectName,
        threshold,
        pos,
        psos,
        cos: coRows,
        poAttainments,
        psoAttainments
    };
};

module.exports = {
    calculateCoAttainment,
    calculateSingleCoAttainment,
    calculatePoAttainment,
    calculatePsoAttainment,
    buildMatrix
};
