const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Category name must be at least 2 characters long"],
      maxlength: [30, "Category name cannot exceed 30 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    color: {
      type: String,
      default: "#6B7280", // Default gray color
      validate: {
        validator: function (color) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
        },
        message: "Color must be a valid hex color code",
      },
    },
    icon: {
      type: String,
      trim: true,
      default: "folder",
    },
    isActive: {
      type: Boolean,
      default: true,
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
CategorySchema.index({ name: 1 });

// Virtual for task count
CategorySchema.virtual("taskCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "category",
  count: true,
});

// Ensure virtual fields are serialized
CategorySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Category", CategorySchema);
