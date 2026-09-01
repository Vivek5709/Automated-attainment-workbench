const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * Only ADMIN can set role to ADMIN or COORDINATOR (enforced at controller level).
 *
 * @param {string} name
 * @param {string} email
 * @param {string} password  — plain-text, will be hashed
 * @param {string} role      — ADMIN | TEACHER | COORDINATOR
 */
const register = async (name, email, password, role = "TEACHER") => {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: { name, email, passwordHash, role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    });

    return user;
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Authenticate a user and return a signed JWT.
 *
 * @param {string} email
 * @param {string} password  — plain-text
 * @returns {{ user, token }}
 */
const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    const payload = { userId: user.id, email: user.email, role: user.role };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};

// ─── Get profile ──────────────────────────────────────────────────────────────

const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    return user;
};

// ─── List users (Admin only) ──────────────────────────────────────────────────

const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        },
        orderBy: { id: "asc" }
    });
};

// ─── Change password ──────────────────────────────────────────────────────────

/**
 * Change the password for a user.
 * Users can only change their own password.
 * ADMIN can change anyone's password.
 *
 * @param {number} userId      — the user whose password is being changed
 * @param {string} oldPassword — required when the user is changing their own
 * @param {string} newPassword
 * @param {boolean} isAdmin    — skip old-password check when true
 */
const changePassword = async (userId, oldPassword, newPassword, isAdmin = false) => {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    if (!isAdmin) {
        const valid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!valid) {
            const err = new Error("Current password is incorrect");
            err.statusCode = 401;
            throw err;
        }
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
        where: { id: Number(userId) },
        data: { passwordHash }
    });
};

// ─── Update role (Admin only) ─────────────────────────────────────────────────

const updateUserRole = async (userId, role) => {
    return await prisma.user.update({
        where: { id: Number(userId) },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    });
};

// ─── Delete user (Admin only) ─────────────────────────────────────────────────

const deleteUser = async (userId) => {
    return await prisma.user.delete({
        where: { id: Number(userId) }
    });
};

module.exports = {
    register,
    login,
    getProfile,
    getAllUsers,
    changePassword,
    updateUserRole,
    deleteUser
};
