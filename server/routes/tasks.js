'use strict';

import express from 'express';
import { handleValidationErrors } from '../middlewares/errorHandler.js';
import {
        validateCreateTask,
        validateUpdateTaskCompleted,
        validateUpdateTaskDetails,
        validateDeleteTask,
} from '../validators/tasks.js';
import db from '../models/index.js';
const { Task } = db;

const router = express.Router();

// Helper function to convert from UTC to requested timezone
const convertTasksToTimezone = (tasks, timezone) => {
        if (!timezone) return tasks;

        const tasksArray = Array.isArray(tasks) ? tasks : [tasks];

        const convertedTasks = tasksArray.map((task) => {
                // Convert UTC date to local time in specified timezone with correct offset
                const utcDate = new Date(task.dueDate);
                const offsetMinutes = utcDate.getTimezoneOffset();

                // Adjust the date by the offset to account for DST changes
                const localDate = new Date(
                        utcDate.getTime() - offsetMinutes * 60 * 1000,
                );
                const formattedDate = localDate.toLocaleString('en-US', {
                        timeZone: timezone,
                        hour12: false,
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                });

                task.dueDate = formattedDate;
                return task;
        });

        return Array.isArray(tasks) ? convertedTasks : convertedTasks[0];
};

router.get('/', async (req, res) => {
        const { timezone } = req.query;

        try {
                const tasks = await Task.findAll();
                res.json(convertTasksToTimezone(tasks, timezone));
        } catch (error) {
                res.status(500).json({
                        message: 'Error fetching tasks',
                        error: error.message,
                });
        }
});

router.post(
        '/',
        validateCreateTask,
        handleValidationErrors,
        async (req, res) => {
                const { timezone } = req.query;
                const { title, description, dueDate } = req.body;

                try {
                        const task = await Task.create({
                                title,
                                description,
                                dueDate,
                                completed: false,
                        });
                        res.status(201).json(
                                convertTasksToTimezone(task, timezone),
                        );
                } catch (error) {
                        res.status(500).json({
                                message: 'Error creating task',
                                error: error.message,
                        });
                }
        },
);

// Route for changing only 'completed'
router.patch(
        '/:id/completed',
        validateUpdateTaskCompleted,
        handleValidationErrors,
        async (req, res) => {
                const { timezone } = req.query;
                const { id } = req.params;
                const { completed } = req.body;

                try {
                        const task = await Task.findByPk(id);
                        if (task) {
                                task.completed = completed;
                                await task.save();
                                res.json(
                                        convertTasksToTimezone(task, timezone),
                                );
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

// Route for changing everyting but 'completed'
router.patch(
        '/:id/details',
        validateUpdateTaskDetails,
        handleValidationErrors,
        async (req, res) => {
                const { timezone } = req.query;
                const { id } = req.params;
                const { dueDate, description } = req.body;

                try {
                        const task = await Task.findByPk(id);
                        if (task) {
                                if (dueDate) task.dueDate = dueDate;
                                if (description) task.description = description;
                                await task.save();
                                res.json(
                                        convertTasksToTimezone(task, timezone),
                                );
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

router.delete(
        '/:id',
        validateDeleteTask,
        handleValidationErrors,
        async (req, res) => {
                const { timezone } = req.query;
                const { id } = req.params;

                try {
                        let task = await Task.findByPk(id);
                        if (task) {
                                await task.destroy();
                                task = convertTasksToTimezone(task, timezone);
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
