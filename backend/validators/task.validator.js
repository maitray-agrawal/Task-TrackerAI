import { body } from 'express-validator';

export const taskValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim(),

  body('priority')
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be either Low, Medium, or High'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Personal', 'Work', 'Study', 'Shopping', 'Health', 'Others'])
    .withMessage('Category must be Personal, Work, Study, Shopping, Health, or Others'),

  body('status')
    .optional()
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be Pending or Completed'),

  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid ISO8601 date string')
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
];

export const taskPatchValidationRules = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be Pending or Completed'),
];
