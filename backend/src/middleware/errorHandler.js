/**
 * Centralized error-handling middleware.
 *
 * Handles:
 *  - Manual errors with statusCode (thrown in services)
 *  - Prisma P2002 — unique constraint violation → 409 Conflict
 *  - Prisma P2025 — record not found → 404 Not Found
 *  - Prisma P2003 — foreign key constraint failed → 400 Bad Request
 *  - Prisma P2014 — relation violation → 400 Bad Request
 *  - All others → 500 Internal Server Error
 *
 * Mount LAST in server.js after all routes:
 *   app.use(errorHandler);
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} —`, err.message);

    // Manual errors thrown from services with an explicit statusCode
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Prisma error codes
    const code = err.code;

    if (code === "P2002") {
        const target = err.meta?.target;
        const fields = Array.isArray(target)
            ? target.join(", ")
            : (target || "field");
        return res.status(409).json({
            success: false,
            message: `Duplicate value: a record with that ${fields} already exists.`
        });
    }

    if (code === "P2025") {
        return res.status(404).json({
            success: false,
            message: err.meta?.cause || "Record not found."
        });
    }

    if (code === "P2003") {
        return res.status(400).json({
            success: false,
            message: `Foreign key constraint failed on field: ${err.meta?.field_name || "unknown"}`
        });
    }

    if (code === "P2014") {
        return res.status(400).json({
            success: false,
            message: "Relation violation: the required relation would be broken."
        });
    }

    // Default
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};

module.exports = errorHandler;
