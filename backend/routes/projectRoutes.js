const express = require("express");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectTasks,
} = require("../controllers/projectController");
const {
  protect,
  managerOrAdmin,
  checkProjectAccess,
} = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// Project routes
router.route("/").get(getAllProjects).post(managerOrAdmin, createProject);

router
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Project tasks
router.get("/:id/tasks", getProjectTasks);

module.exports = router;
