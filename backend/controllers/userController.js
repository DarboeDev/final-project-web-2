const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "";
    const isActive = req.query.isActive;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's project count and task count
    const projectCount = await Project.countDocuments({
      $or: [{ projectManager: user._id }, { "teamMembers.user": user._id }],
    });

    const taskCount = await Task.countDocuments({ assignedTo: user._id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          stats: {
            projectCount,
            taskCount,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
  try {
    const { fullName, email, role, department, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }
    }

    // Update fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.department = department !== undefined ? department : user.department;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          department: user.department,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while updating user",
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    const validRoles = ["admin", "project_manager", "team_member"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Must be one of: admin, project_manager, team_member",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent changing own role
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot change your own role",
      });
    }

    // Update user role
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          department: user.department,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while updating user role",
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deletion of admin users (safety measure)
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete admin users",
      });
    }

    // Check if user has active projects or tasks
    const projectCount = await Project.countDocuments({
      projectManager: user._id,
    });
    const taskCount = await Task.countDocuments({
      assignedTo: user._id,
      status: { $ne: "completed" },
    });

    if (projectCount > 0 || taskCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete user with active projects or tasks. Please reassign them first.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

// @desc    Get team members for project assignment
// @route   GET /api/users/team-members
// @access  Private
const getTeamMembers = async (req, res) => {
  try {
    const users = await User.find({
      isActive: true,
      role: { $in: ["team_member", "project_manager"] },
    })
      .select("fullName email role department")
      .sort({ fullName: 1 });

    res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching team members",
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard-stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's task statistics
    const taskStats = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get user's project statistics
    const projectStats = await Project.aggregate([
      {
        $match: {
          $or: [{ projectManager: userId }, { "teamMembers.user": userId }],
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $nin: ["completed", "cancelled"] },
    });

    // Get upcoming tasks (due in next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $gte: new Date(), $lte: nextWeek },
      status: { $nin: ["completed", "cancelled"] },
    });

    res.status(200).json({
      success: true,
      data: {
        taskStats,
        projectStats,
        overdueTasks,
        upcomingTasks,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard stats",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { fullName, email, department, currentPassword, newPassword } =
      req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to set new password",
        });
      }

      const isCurrentPasswordCorrect = await user.matchPassword(
        currentPassword
      );
      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      user.password = newPassword;
    }

    // Update profile fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (department !== undefined) user.department = department;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTeamMembers,
  getDashboardStats,
  updateProfile,
  updateUserRole,
};
