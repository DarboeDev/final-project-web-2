const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: "User account is deactivated",
        });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};

// Admin access only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};

// Project manager or admin access
const managerOrAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "project_manager")
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Manager or Admin privileges required.",
    });
  }
};

// Check if user can access specific project
const checkProjectAccess = async (req, res, next) => {
  try {
    const Project = require("../models/Project");
    const projectId = req.params.projectId || req.body.project;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Admin can access all projects
    if (req.user.role === "admin") {
      req.project = project;
      return next();
    }

    // Project manager can access their projects
    if (
      req.user.role === "project_manager" &&
      project.projectManager.toString() === req.user._id.toString()
    ) {
      req.project = project;
      return next();
    }

    // Team members can access projects they're assigned to
    const isTeamMember = project.teamMembers.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (isTeamMember) {
      req.project = project;
      return next();
    }

    return res.status(403).json({
      success: false,
      message:
        "Access denied. You don't have permission to access this project.",
    });
  } catch (error) {
    console.error("Project access check error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while checking project access",
    });
  }
};

module.exports = {
  protect,
  adminOnly,
  managerOrAdmin,
  checkProjectAccess,
};
