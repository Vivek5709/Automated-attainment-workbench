const authService = require("../services/auth.service");

// ─── Register ─────────────────────────────────────────────────────────────────

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "name, email, and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "password must be at least 6 characters long"
            });
        }

        // Validate role if provided
        const validRoles = ["ADMIN", "TEACHER", "COORDINATOR"];
        const assignedRole = role ? role.toUpperCase() : "TEACHER";

        if (!validRoles.includes(assignedRole)) {
            return res.status(400).json({
                success: false,
                message: `role must be one of: ${validRoles.join(", ")}`
            });
        }

        // If trying to register as ADMIN or COORDINATOR, ensure caller is ADMIN (or first user setup)
        // If req.user exists and is not ADMIN, block non-TEACHER role assignment
        if (req.user && req.user.role !== "ADMIN" && assignedRole !== "TEACHER") {
            return res.status(403).json({
                success: false,
                message: "Only administrators can create ADMIN or COORDINATOR accounts"
            });
        }

        const user = await authService.register(name, email, password, assignedRole);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required"
            });
        }

        const result = await authService.login(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// ─── Profile (Get Me) ─────────────────────────────────────────────────────────

const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.user.userId);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// ─── Get All Users (Admin only) ───────────────────────────────────────────────

const getAllUsers = async (req, res, next) => {
    try {
        const users = await authService.getAllUsers();

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// ─── Change Password ──────────────────────────────────────────────────────────

const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const targetUserId = req.params.id ? Number(req.params.id) : req.user.userId;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "newPassword is required and must be at least 6 characters"
            });
        }

        const isAdmin = req.user.role === "ADMIN" && targetUserId !== req.user.userId;

        await authService.changePassword(targetUserId, oldPassword, newPassword, isAdmin);

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

// ─── Update Role (Admin only) ─────────────────────────────────────────────────

const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const validRoles = ["ADMIN", "TEACHER", "COORDINATOR"];
        if (!role || !validRoles.includes(role.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: `role must be one of: ${validRoles.join(", ")}`
            });
        }

        const updated = await authService.updateUserRole(id, role.toUpperCase());

        res.status(200).json({
            success: true,
            data: updated
        });
    } catch (error) {
        next(error);
    }
};

// ─── Delete User (Admin only) ─────────────────────────────────────────────────

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (Number(id) === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        await authService.deleteUser(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        next(error);
    }
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
