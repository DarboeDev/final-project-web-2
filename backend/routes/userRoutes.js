const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateProfile,
  updateUserRole,
  deleteUser,
  getTeamMembers,
  getDashboardStats,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// General user routes
router.get("/team-members", getTeamMembers);
router.get("/dashboard-stats", getDashboardStats);
router.put("/profile", updateProfile);

// Admin only routes
router.get("/", adminOnly, getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", adminOnly, updateUser);
router.put("/:id/role", adminOnly, updateUserRole);
router.delete("/:id", adminOnly, deleteUser);

module.exports = router;
