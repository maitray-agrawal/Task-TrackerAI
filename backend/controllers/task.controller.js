import Task from '../models/task.model.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all tasks with search, filter, sort, pagination
// @route   GET /api/tasks
// @access  Public
export const getTasks = asyncHandler(async (req, res) => {
  const { q, status, priority, category, sortBy, page = 1, limit = 10 } = req.query;

  const match = {};

  // Search by title or description
  if (q) {
    match.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }

  // Filters
  if (status) {
    match.status = status;
  }
  if (priority) {
    match.priority = priority;
  }
  if (category) {
    match.category = category;
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skipNum = (pageNum - 1) * limitNum;

  // Build aggregation pipeline for advanced sorting and pagination
  const pipeline = [{ $match: match }];

  // Priority sorting: High (1) -> Medium (2) -> Low (3)
  if (sortBy === 'priority') {
    pipeline.push({
      $addFields: {
        priorityOrder: {
          $switch: {
            branches: [
              { case: { $eq: ['$priority', 'High'] }, then: 1 },
              { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
              { case: { $eq: ['$priority', 'Low'] }, then: 3 },
            ],
            default: 4,
          },
        },
      },
    });
    pipeline.push({ $sort: { priorityOrder: 1, createdAt: -1 } });
  } else {
    const sort = {};
    if (sortBy === 'oldest') {
      sort.createdAt = 1;
    } else if (sortBy === 'dueDate') {
      sort.dueDate = 1;
    } else if (sortBy === 'alphabetical') {
      sort.title = 1;
    } else {
      sort.createdAt = -1; // default newest
    }
    pipeline.push({ $sort: sort });
  }

  // Get total count matching criteria
  const totalTasks = await Task.countDocuments(match);

  // Apply pagination
  pipeline.push({ $skip: skipNum });
  pipeline.push({ $limit: limitNum });

  const tasks = await Task.aggregate(pipeline);

  res.status(200).json({
    success: true,
    count: tasks.length,
    pagination: {
      totalTasks,
      totalPages: Math.ceil(totalTasks / limitNum),
      currentPage: pageNum,
      limit: limitNum,
    },
    tasks,
  });
});

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error(`Task not found with id of ${req.params.id}`);
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Public
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error(`Task not found with id of ${req.params.id}`);
    error.statusCode = 404;
    return next(error);
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Public
export const updateTaskStatus = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error(`Task not found with id of ${req.params.id}`);
    error.statusCode = 404;
    return next(error);
  }

  task.status = req.body.status;
  await task.save();

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error(`Task not found with id of ${req.params.id}`);
    error.statusCode = 404;
    return next(error);
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
