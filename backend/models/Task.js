const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Task title must be at least 3 characters long"],
      maxlength: [100, "Task title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "completed", "cancelled"],
        message:
          "Status must be one of: pending, in-progress, completed, cancelled",
      },
      default: "pending",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "Priority must be one of: low, medium, high, urgent",
      },
      default: "medium",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (dueDate) {
          return !dueDate || dueDate >= new Date();
        },
        message: "Due date cannot be in the past",
      },
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must be assigned to a user"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by field is required"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Task must belong to a project"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    estimatedHours: {
      type: Number,
      min: [0, "Estimated hours cannot be negative"],
      default: 0,
    },
    actualHours: {
      type: Number,
      min: [0, "Actual hours cannot be negative"],
      default: 0,
    },
    progress: {
      type: Number,
      min: [0, "Progress cannot be negative"],
      max: [100, "Progress cannot exceed 100%"],
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: [true, "Comment text is required"],
          trim: true,
          maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [
      {
        fileName: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
          required: true,
        },
        mimeType: {
          type: String,
          required: true,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    completedAt: {
      type: Date,
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ priority: 1, status: 1 });

// Update completedAt when status changes to completed
TaskSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "completed" && !this.completedAt) {
      this.completedAt = new Date();
      this.progress = 100;
    } else if (this.status !== "completed") {
      this.completedAt = null;
    }
  }
  next();
});

// Virtual for overdue status
TaskSchema.virtual("isOverdue").get(function () {
  return (
    this.dueDate && this.dueDate < new Date() && this.status !== "completed"
  );
});

// Ensure virtual fields are serialized
TaskSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Task", TaskSchema);
