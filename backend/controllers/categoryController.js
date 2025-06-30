const Category = require("../models/Category");
const Task = require("../models/Task");

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Manager/Admin)
const createCategory = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const category = await Category.create({
      name,
      description,
      color: color || "#6B7280",
      icon: icon || "folder",
      createdBy: req.user._id,
    });

    await category.populate("createdBy", "fullName email");

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { category },
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating category",
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const isActive = req.query.isActive;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const skip = (page - 1) * limit;

    const categories = await Category.find(query)
      .populate("createdBy", "fullName email")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments(query);

    // Add task count for each category
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const taskCount = await Task.countDocuments({ category: category._id });

        return {
          ...category.toObject(),
          taskCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        categories: categoriesWithStats,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Get all categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "createdBy",
      "fullName email"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get category statistics
    const taskCount = await Task.countDocuments({ category: category._id });
    const completedTasks = await Task.countDocuments({
      category: category._id,
      status: "completed",
    });

    res.status(200).json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          stats: {
            taskCount,
            completedTasks,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get category by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching category",
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Manager/Admin)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check permission
    const canUpdate =
      req.user.role === "admin" ||
      req.user.role === "project_manager" ||
      category.createdBy.toString() === req.user._id.toString();

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this category",
      });
    }

    const { name, description, color, icon, isActive } = req.body;

    // Check if name is being changed and if it already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: category._id },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name || category.name,
        description:
          description !== undefined ? description : category.description,
        color: color || category.color,
        icon: icon || category.icon,
        isActive: isActive !== undefined ? isActive : category.isActive,
      },
      { new: true, runValidators: true }
    ).populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: { category: updatedCategory },
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while updating category",
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Manager/Admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check permission
    const canDelete =
      req.user.role === "admin" ||
      req.user.role === "project_manager" ||
      category.createdBy.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this category",
      });
    }

    // Check if category has associated tasks
    const taskCount = await Task.countDocuments({ category: category._id });

    if (taskCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${taskCount} associated task(s). Please reassign or delete the tasks first.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting category",
    });
  }
};

// @desc    Get active categories for dropdown
// @route   GET /api/categories/active
// @access  Private
const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select("name color icon")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error("Get active categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching active categories",
    });
  }
};

// @desc    Get category tasks
// @route   GET /api/categories/:id/tasks
// @access  Private
const getCategoryTasks = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let query = { category: categoryId };
    if (status) {
      query.status = status;
    }

    // Filter tasks based on user permissions
    if (req.user.role !== "admin") {
      const Project = require("../models/Project");
      const userProjects = await Project.find({
        $or: [
          { projectManager: req.user._id },
          { "teamMembers.user": req.user._id },
        ],
      }).select("_id");

      const projectIds = userProjects.map((p) => p._id);

      query.$and = [
        { category: categoryId },
        {
          $or: [
            { assignedTo: req.user._id },
            { createdBy: req.user._id },
            { project: { $in: projectIds } },
          ],
        },
      ];
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .populate("assignedTo", "fullName email")
      .populate("createdBy", "fullName email")
      .populate("project", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tasks,
        category: {
          name: category.name,
          color: category.color,
          icon: category.icon,
        },
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Get category tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching category tasks",
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getActiveCategories,
  getCategoryTasks,
};
