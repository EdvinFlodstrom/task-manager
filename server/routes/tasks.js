'use strict';

import express from 'express';
import { handleValidationErrors } from '../middlewares/errorHandler.js';
import {
        validateCreateTask,
        validateUpdateTaskCompleted,
        validateUpdateTaskDetails,
        validateDeleteTask,
} from '../validators/tasks.js';
import { Op } from 'sequelize';
import db from '../models/index.js';

const { Task } = db;
const router = express.Router();

// Fetch all tasks
router.get('/', async (req, res) => {
        try {
                const tasks = await Task.findAll();
                res.json(tasks);
        } catch (error) {
                res.status(500).json({
                        message: 'Error fetching tasks',
                        error: error.message,
                });
        }
});

// Fetch all upcoming, incomplete tasks
router.get('/upcoming', async (req, res) => {
        try {
                const today = new Date();

                const tasks = await Task.findAll({
                        where: {
                                dueDate: {
                                        [Op.gte]: today,
                                },
                                completed: false,
                        },
                });

                res.json(tasks);
        } catch (error) {
                res.status(500).json({
                        message: 'Error fetching upcoming tasks',
                        error: error.message,
                });
        }
});

// Create a task with a title and due date, with an optional description
router.post(
        '/',
        validateCreateTask,
        handleValidationErrors,
        async (req, res) => {
                const { title, description, dueDate } = req.body;

                try {
                        const task = await Task.create({
                                title,
                                description,
                                dueDate,
                                completed: false,
                        });
                        res.status(201).json(task);
                } catch (error) {
                        res.status(500).json({
                                message: 'Error creating task',
                                error: error.message,
                        });
                }
        },
);

// Change only 'completed'
router.patch(
        '/:id/completed',
        validateUpdateTaskCompleted,
        handleValidationErrors,
        async (req, res) => {
                const { id } = req.params;
                const { completed } = req.body;

                try {
                        const task = await Task.findByPk(id);
                        if (task) {
                                task.completed = completed;
                                await task.save();
                                res.json(task);
                        } else {
                                res.status(404).send('Task not found');
                        }
                } catch (error) {
                        res.status(500).json({
                                message: 'Error updating task',
                                error: error.message,
                        });
                }
        },
);

// Change description and/or due date
router.patch(
        '/:id/details',
        validateUpdateTaskDetails,
        handleValidationErrors,
        async (req, res) => {
                const { id } = req.params;
                const { dueDate, description } = req.body;

                try {
                        const task = await Task.findByPk(id);
                        if (task) {
                                if (dueDate) task.dueDate = dueDate;
                                if (description) task.description = description;
                                await task.save();
                                res.json(task);
                        } else {
                                res.status(404).send('Task not found');
                        }
                } catch (error) {
                        res.status(500).json({
                                message: 'Error updating task',
                                error: error.message,
                        });
                }
        },
);

// Delete a single task
router.delete(
        '/:id',
        validateDeleteTask,
        handleValidationErrors,
        async (req, res) => {
                const { id } = req.params;

                try {
                        let task = await Task.findByPk(id);
                        if (task) {
                                await task.destroy();
                                res.json({
                                        message: 'Task deleted',
                                        task: task,
                                });
                        } else {
                                res.status(404).send('Task not found');
                        }
                } catch (error) {
                        res.status(500).json({
                                message: 'Error deleting task',
                                error: error.message,
                        });
                }
        },
);

export default router;
