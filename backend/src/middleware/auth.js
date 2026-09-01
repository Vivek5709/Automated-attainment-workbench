const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware: verify JWT from Authorization header.
 *
 * Sets req.user = { userId, email, role } on success.
 * Returns 401 if token is missing, malformed, or expired.
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Provide a Bearer token."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { userId, email, role }
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please log in again."
            });
        }
        return res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }
};

/**
 * Middleware factory: restrict access to specific roles.
 *
 * Usage: authorize("ADMIN") or authorize("ADMIN", "COORDINATOR")
 *
 * Must be used after authenticate().
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(" or ")}.`
            });
        }

        next();
    };
};

module.exports = { authenticate, authorize };
