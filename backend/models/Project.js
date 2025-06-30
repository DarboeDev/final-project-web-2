const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [2, "Project name must be at least 2 characters long"],
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["planning", "active", "on_hold", "completed", "cancelled"],
        message:
          "Status must be one of: planning, active, on_hold, completed, cancelled",
      },
      default: "planning",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "Priority must be one of: low, medium, high, urgent",
      },
      default: "medium",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project manager is required"],
    },
    teamMembers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["developer", "designer", "tester", "analyst"],
          default: "developer",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
      default: 0,
    },
    progress: {
      type: Number,
      min: [0, "Progress cannot be negative"],
      max: [100, "Progress cannot exceed 100%"],
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
ProjectSchema.index({ name: 1, status: 1 });
ProjectSchema.index({ projectManager: 1 });
ProjectSchema.index({ "teamMembers.user": 1 });

// Virtual for task count
ProjectSchema.virtual("taskCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
  count: true,
});

// Ensure virtual fields are serialized
ProjectSchema.set("toJSON", { virtuals: true });

// Pre-save hook to validate dates
ProjectSchema.pre("save", function (next) {
  // Validate end date is after start date
  if (this.endDate && this.startDate) {
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    if (endDate <= startDate) {
      const error = new Error("End date must be after start date");
      error.name = "ValidationError";
      return next(error);
    }
  }

  next();
});

// Pre-update hook for date validation during updates
ProjectSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  // Skip validation here - we'll handle it in the controller
  next();
});

module.exports = mongoose.model("Project", ProjectSchema);
