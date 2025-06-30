const express = require("express");
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  uploadAttachment,
  getMyTasks,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { upload, handleMulterError } = require("../middleware/uploadMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// Task routes
router.route("/").get(getAllTasks).post(createTask);

// My tasks
router.get("/my-tasks", getMyTasks);

router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

// Task comments
router.post("/:id/comments", addComment);

// Task attachments
router.post(
  "/:id/attachments",
  upload.single("attachment"),
  handleMulterError,
  uploadAttachment
);

module.exports = router;
