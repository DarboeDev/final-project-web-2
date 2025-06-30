const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Manager/Admin)
const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      projectManager,
      teamMembers,
      budget,
      tags,
    } = req.body;

    // Validation
    if (!name || !projectManager) {
      return res.status(400).json({
        success: false,
        message: "Project name and project manager are required",
      });
    }

    // Check if project manager exists
    const manager = await User.findById(projectManager);
    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Project manager not found",
      });
    }

    // Validate team members if provided
    if (teamMembers && teamMembers.length > 0) {
      const memberIds = teamMembers.map((member) =>
        typeof member === "object" && member.user ? member.user : member
      );
      const validMembers = await User.find({ _id: { $in: memberIds } });

      if (validMembers.length !== memberIds.length) {
        return res.status(400).json({
          success: false,
          message: "Some team members not found",
        });
      }
    }

    // Validate dates
    const finalStartDate = startDate ? new Date(startDate) : new Date();
    const finalEndDate = endDate ? new Date(endDate) : null;

    if (finalStartDate && finalEndDate && finalEndDate <= finalStartDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const project = await Project.create({
      name,
      description,
      status: status || "planning",
      priority: priority || "medium",
      startDate: startDate || new Date(),
      endDate,
      projectManager,
      teamMembers: teamMembers || [],
      budget: budget || 0,
      tags: tags || [],
      createdBy: req.user._id,
    });

    await project.populate([
      { path: "projectManager", select: "fullName email" },
      { path: "teamMembers.user", select: "fullName email" },
      { path: "createdBy", select: "fullName email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating project",
    });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const priority = req.query.priority || "";

    // Build query based on user role
    let query = {};

    // If not admin, only show projects user is involved in
    if (req.user.role !== "admin") {
      query.$or = [
        { projectManager: req.user._id },
        { "teamMembers.user": req.user._id },
      ];
    }

    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
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

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate("projectManager", "fullName email")
      .populate("teamMembers.user", "fullName email")
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(query);

    // Add task count for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ project: project._id });
        const completedTasks = await Task.countDocuments({
          project: project._id,
          status: "completed",
        });

        return {
          ...project.toObject(),
          taskCount,
          completedTasks,
          progressPercentage:
            taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        projects: projectsWithStats,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Get all projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching projects",
    });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("projectManager", "fullName email department")
      .populate("teamMembers.user", "fullName email department")
      .populate("createdBy", "fullName email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check access permission
    const hasAccess =
      req.user.role === "admin" ||
      project.projectManager._id.toString() === req.user._id.toString() ||
      project.teamMembers.some(
        (member) => member.user._id.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Get project statistics
    const taskStats = await Task.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalTasks = await Task.countDocuments({ project: project._id });
    const completedTasks = await Task.countDocuments({
      project: project._id,
      status: "completed",
    });

    res.status(200).json({
      success: true,
      data: {
        project: {
          ...project.toObject(),
          stats: {
            taskStats,
            totalTasks,
            completedTasks,
            progressPercentage:
              totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get project by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching project",
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Manager/Admin)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check permission
    const canUpdate =
      req.user.role === "admin" ||
      project.projectManager.toString() === req.user._id.toString();

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    const {
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      projectManager,
      teamMembers,
      budget,
      tags,
      progress,
    } = req.body;

    // Validate project manager if being updated
    if (
      projectManager &&
      projectManager !== project.projectManager.toString()
    ) {
      const manager = await User.findById(projectManager);
      if (!manager) {
        return res.status(404).json({
          success: false,
          message: "Project manager not found",
        });
      }
    }

    // Validate team members if being updated
    if (teamMembers) {
      const memberIds = teamMembers.map((member) => member.user);
      const validMembers = await User.find({ _id: { $in: memberIds } });

      if (validMembers.length !== memberIds.length) {
        return res.status(400).json({
          success: false,
          message: "Some team members not found",
        });
      }
    }

    // Validate dates if being updated
    const finalStartDate = startDate ? new Date(startDate) : project.startDate;
    const finalEndDate =
      endDate !== undefined
        ? endDate
          ? new Date(endDate)
          : null
        : project.endDate;

    if (finalStartDate && finalEndDate && finalEndDate <= finalStartDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: name || project.name,
        description:
          description !== undefined ? description : project.description,
        status: status || project.status,
        priority: priority || project.priority,
        startDate: startDate || project.startDate,
        endDate: endDate !== undefined ? endDate : project.endDate,
        projectManager: projectManager || project.projectManager,
        teamMembers:
          teamMembers !== undefined ? teamMembers : project.teamMembers,
        budget: budget !== undefined ? budget : project.budget,
        tags: tags !== undefined ? tags : project.tags,
        progress: progress !== undefined ? progress : project.progress,
      },
      { new: true, runValidators: true }
    ).populate([
      { path: "projectManager", select: "fullName email" },
      { path: "teamMembers.user", select: "fullName email" },
      { path: "createdBy", select: "fullName email" },
    ]);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: { project: updatedProject },
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while updating project",
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Manager/Admin)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check permission
    const canDelete =
      req.user.role === "admin" ||
      project.projectManager.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this project",
      });
    }

    // Check if project has active tasks
    const activeTasks = await Task.countDocuments({
      project: project._id,
      status: { $nin: ["completed", "cancelled"] },
    });

    if (activeTasks > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete project with active tasks. Complete or cancel all tasks first.",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting project",
    });
  }
};

// @desc    Get project tasks
// @route   GET /api/projects/:id/tasks
// @access  Private
const getProjectTasks = async (req, res) => {
  try {
    const projectId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const hasAccess =
      req.user.role === "admin" ||
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

    let query = { project: projectId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .populate("assignedTo", "fullName email")
      .populate("createdBy", "fullName email")
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
    console.error("Get project tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching project tasks",
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectTasks,
};
