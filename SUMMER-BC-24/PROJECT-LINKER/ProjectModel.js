const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, "No name for author"],
    },
    institution: {
      type: String,
      required: [true, "No institution"],
    },
    projectType: {
      type: String,
      enum: ["yedu-blog", "yedu-music"],
      required: [true, "Project type cannot be empty"],
    },
    projectUrl: String,
    authorImg: String,
    projectImg: String,
    likes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
