'use strict';

import { body, param } from 'express-validator';
import { ensureDateIsNotPast } from './customRules.js';

// Task creation: POST
export const validateCreateTask = [
        body('title')
                .notEmpty()
                .withMessage('Title is required')
                .trim()
                .escape(),
        body('dueDate')
                .optional()
                .isISO8601()
                .withMessage('Due date must be a valid ISO8601 date')
                .toDate()
                .custom(ensureDateIsNotPast),
        body('description').optional().trim().escape(),
];

// Update task (only 'completed'): PATCH
export const validateUpdateTaskCompleted = [
        param('id')
                .notEmpty()
                .withMessage('Task ID is required')
                .isInt()
                .withMessage('Task ID must be an integer')
                .toInt(),
        body('completed')
                .notEmpty()
                .withMessage('Completed status is required')
                .isBoolean()
                .withMessage('Completed must be a boolean')
                .toBoolean(),
];

// Update task ('description' and 'dueDate'): PATCH
export const validateUpdateTaskDetails = [
        param('id')
                .notEmpty()
                .withMessage('Task ID is required')
                .isInt()
                .withMessage('Task ID must be an integer')
                .toInt(),
        body('title').optional().trim().escape(),
        body('dueDate')
                .optional()
                .isISO8601()
                .withMessage('Due date must be a valid ISO08601 date')
                .toDate()
                .custom(ensureDateIsNotPast),
        body('description').optional().trim().escape(),
];

// Delete task (validate ID): DELETE
export const validateDeleteTask = [
        param('id')
                .notEmpty()
                .withMessage('Task ID is required')
                .isInt()
                .withMessage('Task ID must be an integer')
                .toInt(),
];
