import express from 'express';
import db from './models/index.js';
const { Task } = db;
const app = express();

app.use(express.json());

app.get('/tasks', async (req, res) => {
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

app.post('/tasks', async (req, res) => {
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

app.put('/tasks/:id', async (req, res) => {
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

app.delete('/tasks/:id', async (req, res) => {
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

app.listen(3001, () => {
        console.log('Server listening on http://localhost:3001');
});
