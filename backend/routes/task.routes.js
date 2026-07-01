import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/task.controller.js';
import { taskValidationRules, taskPatchValidationRules } from '../validators/task.validator.js';
import validate, { validateObjectId } from '../middlewares/validate.middleware.js';

const router = express.Router();

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Retrieve a list of tasks
 *     description: Fetch tasks with filtering (q, status, priority, category), pagination, and advanced sorting (newest, oldest, dueDate, alphabetical, priority).
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query matching title or description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Completed]
 *         description: Filter tasks by completion status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *         description: Filter tasks by priority level
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Work, Personal, Shopping, Others]
 *         description: Filter tasks by category
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, oldest, dueDate, alphabetical, priority]
 *         description: Field/rule to sort tasks by
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of tasks per page
 *     responses:
 *       200:
 *         description: A successful response containing tasks data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tasks retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 1
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalTasks:
 *                           type: integer
 *                           example: 12
 *                         totalPages:
 *                           type: integer
 *                           example: 2
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create a new task
 *     description: Submit new task details to the server. Due dates in the past are rejected.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn Swagger API Docs
 *               description:
 *                 type: string
 *                 example: Read specifications and integrate Swagger in the MERN stack
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: Medium
 *               category:
 *                 type: string
 *                 enum: [Work, Personal, Shopping, Others]
 *                 example: Work
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-20T18:30:00.000Z
 *     responses:
 *       201:
 *         description: Task successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router
  .route('/')
  .get(getTasks)
  .post(taskValidationRules, validate, createTask);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: Retrieve a single task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task
 *     responses:
 *       200:
 *         description: Task data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid task ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update an existing task's fields
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid task ID or body parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Task not found
 */
router
  .route('/:id')
  .get(validateObjectId, getTaskById)
  .put(validateObjectId, taskValidationRules, validate, updateTask)
  .delete(validateObjectId, deleteTask);

/**
 * @openapi
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update task completion status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed]
 *                 example: Completed
 *     responses:
 *       200:
 *         description: Task status changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task status updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid status value or ID
 *       404:
 *         description: Task not found
 */
router.patch('/:id/status', validateObjectId, taskPatchValidationRules, validate, updateTaskStatus);

export default router;
