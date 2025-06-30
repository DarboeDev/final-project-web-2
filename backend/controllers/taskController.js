const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      project,
      category,
      tags,
      estimatedHours,
    } = req.body;

    // Validation
    if (!title || !assignedTo || !project) {
      return res.status(400).json({
        success: false,
        message: "Title, assigned user, and project are required",
      });
    }

    // Check if assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    // Check if project exists and user has access to create tasks
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const hasAccess =
      req.user.role === "admin" ||
      projectDoc.projectManager.toString() === req.user._id.toString() ||
      projectDoc.teamMembers.some(
        (member) => member.user.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to create tasks in this project",
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      priority: priority || "medium",
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      project,
      category,
      tags: tags || [],
      estimatedHours: estimatedHours || 0,
    });

    await task.populate([
      { path: "assignedTo", select: "fullName email" },
      { path: "createdBy", select: "fullName email" },
      { path: "project", select: "name" },
      { path: "category", select: "name color" },
    ]);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating task",
    });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const priority = req.query.priority || "";
    const project = req.query.project || "";
    const assignedTo = req.query.assignedTo || "";

    // Build query based on user role
    let query = {};

    // If not admin, only show tasks user is involved in
    if (req.user.role !== "admin") {
      const userProjects = await Project.find({
        $or: [
          { projectManager: req.user._id },
          { "teamMembers.user": req.user._id },
        ],
      }).select("_id");

      const projectIds = userProjects.map((p) => p._id);

      query.$or = [
        { assignedTo: req.user._id },
        { createdBy: req.user._id },
        { project: { $in: projectIds } },
      ];
    }

    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (project) {
      query.project = project;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .populate("assignedTo", "fullName email")
      .populate("createdBy", "fullName email")
      .populate({
        path: "project",
        select: "name projectManager",
        populate: {
          path: "projectManager",
          select: "fullName email",
        },
      })
      .populate("category", "name color")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Get all tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching tasks",
    });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "fullName email department")
      .populate("createdBy", "fullName email")
      .populate({
        path: "project",
        select: "name projectManager",
        populate: {
          path: "projectManager",
          select: "fullName email",
        },
      })
      .populate("category", "name color")
      .populate("comments.user", "fullName email")
      .populate("attachments.uploadedBy", "fullName email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check access permission
    const project = await Project.findById(task.project);
    const hasAccess =
      req.user.role === "admin" ||
      task.assignedTo._id.toString() === req.user._id.toString() ||
      task.createdBy._id.toString() === req.user._id.toString() ||
      project.projectManager.toString() === req.user._id.toString() ||
      project.teamMembers.some(
        (member) => member.user.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error("Get task by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching task",
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check permission
    const project = await Project.findById(task.project);
    const canUpdate =
      req.user.role === "admin" ||
      task.assignedTo.toString() === req.user._id.toString() ||
      task.createdBy.toString() === req.user._id.toString() ||
      project.projectManager.toString() === req.user._id.toString();

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      category,
      tags,
      estimatedHours,
      actualHours,
      progress,
    } = req.body;

    // Validate assigned user if being updated
    if (assignedTo && assignedTo !== task.assignedTo.toString()) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found",
        });
      }
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
        priority: priority || task.priority,
        dueDate: dueDate !== undefined ? dueDate : task.dueDate,
        assignedTo: assignedTo || task.assignedTo,
        category: category !== undefined ? category : task.category,
        tags: tags !== undefined ? tags : task.tags,
        estimatedHours:
          estimatedHours !== undefined ? estimatedHours : task.estimatedHours,
        actualHours: actualHours !== undefined ? actualHours : task.actualHours,
        progress: progress !== undefined ? progress : task.progress,
      },
      { new: true, runValidators: true }
    ).populate([
      { path: "assignedTo", select: "fullName email" },
      { path: "createdBy", select: "fullName email" },
      {
        path: "project",
        select: "name projectManager",
        populate: {
          path: "projectManager",
          select: "fullName email",
        },
      },
      { path: "category", select: "name color" },
    ]);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while updating task",
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check permission
    const project = await Project.findById(task.project);
    const canDelete =
      req.user.role === "admin" ||
      task.createdBy.toString() === req.user._id.toString() ||
      project.projectManager.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    // Delete associated files
    if (task.attachments && task.attachments.length > 0) {
      task.attachments.forEach((attachment) => {
        const filePath = path.join(__dirname, "..", attachment.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting task",
    });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check access permission
    const project = await Project.findById(task.project);
    const hasAccess =
      req.user.role === "admin" ||
      task.assignedTo.toString() === req.user._id.toString() ||
      task.createdBy.toString() === req.user._id.toString() ||
      project.projectManager.toString() === req.user._id.toString() ||
      project.teamMembers.some(
        (member) => member.user.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    task.comments.push({
      user: req.user._id,
      text: text.trim(),
    });

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "comments.user",
      "fullName email"
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        comments: updatedTask.comments,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while adding comment",
    });
  }
};

// @desc    Upload attachment to task
// @route   POST /api/tasks/:id/attachments
// @access  Private
const uploadAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check access permission
    const project = await Project.findById(task.project);
    const hasAccess =
      req.user.role === "admin" ||
      task.assignedTo.toString() === req.user._id.toString() ||
      task.createdBy.toString() === req.user._id.toString() ||
      project.projectManager.toString() === req.user._id.toString() ||
      project.teamMembers.some(
        (member) => member.user.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const attachment = {
      fileName: req.file.originalname,
      filePath: `uploads/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user._id,
    };

    task.attachments.push(attachment);
    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "attachments.uploadedBy",
      "fullName email"
    );

    res.status(201).json({
      success: true,
      message: "Attachment uploaded successfully",
      data: {
        attachments: updatedTask.attachments,
      },
    });
  } catch (error) {
    console.error("Upload attachment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while uploading attachment",
    });
  }
};

// @desc    Get my tasks (assigned to current user)
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
  try {
    const status = req.query.status || "";
    const priority = req.query.priority || "";

    let query = { assignedTo: req.user._id };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const tasks = await Task.find(query)
      .populate({
        path: "project",
        select: "name projectManager",
        populate: {
          path: "projectManager",
          select: "fullName email",
        },
      })
      .populate("category", "name color")
      .populate("createdBy", "fullName email")
      .sort({ dueDate: 1, priority: -1 });

    res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    console.error("Get my tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching tasks",
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  uploadAttachment,
  getMyTasks,
};
