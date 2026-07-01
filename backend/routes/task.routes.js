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
import validate from '../middlewares/validate.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(getTasks)
  .post(taskValidationRules, validate, createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(taskValidationRules, validate, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', taskPatchValidationRules, validate, updateTaskStatus);

export default router;
