const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getActiveCategories,
  getCategoryTasks,
} = require("../controllers/categoryController");
const { protect, managerOrAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// Category routes
router.route("/").get(getAllCategories).post(managerOrAdmin, createCategory);

// Active categories for dropdown
router.get("/active", getActiveCategories);

router
  .route("/:id")
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

// Category tasks
router.get("/:id/tasks", getCategoryTasks);

module.exports = router;
