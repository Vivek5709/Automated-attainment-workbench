const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate, authorize } = require("../middleware/auth");

// Public endpoints
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected endpoints (Authenticated users)
router.get("/me", authenticate, authController.getProfile);
router.put("/change-password", authenticate, authController.changePassword);

// Admin-only user management
router.get("/users", authenticate, authorize("ADMIN"), authController.getAllUsers);
router.put("/users/:id/role", authenticate, authorize("ADMIN"), authController.updateUserRole);
router.delete("/users/:id", authenticate, authorize("ADMIN"), authController.deleteUser);

module.exports = router;
