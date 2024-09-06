const express = require("express");
const app = express();
const morgan = require("morgan");

const globalErrorHandler = require("./globalErrorHandler");
const catchAsync = require("./catchAsync");
const AppError = require("./AppError");

const Project = require("./ProjectModel");

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow the GET, POST, PUT, DELETE methods
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); // Allow specific headers
  next();
});

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.post(
  "/api/v1/project",
  catchAsync(async (req, res, next) => {
    if (!req.body?.projectType) next(new AppError("Invalid project type."));

    const newProject = await Project.create({
      ...req.body,
      projectType: req.body.projectType?.toLowerCase(),
    });

    res.status(200).json({
      status: "success",
      newProject,
    });
  })
);

app.patch(
  "/api/v1/like/:id",
  catchAsync(async (req, res, next) => {
    const project = await Project.findByIdAndUpdate(
      req.params?.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      project,
    });
  })
);

app.patch(
  "/api/v1/unlike/:id",
  catchAsync(async (req, res, next) => {
    const project = await Project.findByIdAndUpdate(
      req.params?.id,
      { $inc: { likes: -1 } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      project,
    });
  })
);

app.get(
  "/api/v1/project/:id?",
  catchAsync(async (req, res) => {
    const projects = await Project.find({ _id: { $ne: req.params?.id } });

    res.status(200).json({
      status: "success",
      results: projects?.length,
      projects,
    });
  })
);

app.get(
  "/api/v1/my-project/:id?",
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params?.id);

    res.status(200).json({
      status: "success",
      project,
    });
  })
);

app.all("*", (req, res, next) => {
  const errMessage = `Can't find ${req.originalUrl} on this server`;

  res.status(404).json({
    status: "failed",
    message: errMessage,
  });
});

app.use(globalErrorHandler);

module.exports = app;
