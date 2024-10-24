'use strict';

import express from 'express';
import db from '../models/index.js';
const { Task } = db;

const router = express.Router();

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

router.post('/', async (req, res) => {
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
});

router.put('/:id', async (req, res) => {
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
});

router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
                const task = await Task.findByPk(id);
                if (task) {
                        await task.destroy();
                        res.json({ message: 'Task deleted', task: task });
                } else {
                        res.status(404).send('Task not found');
                }
        } catch (error) {
                res.status(500).json({
                        message: 'Error deleting task',
                        error: error.message,
                });
        }
});

export default router;
