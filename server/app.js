import express from 'express';
import tasksRouter from './routes/tasks.js';

const app = express();

app.use(express.json());

// Task routes
app.use('/tasks', tasksRouter);

// 404 Not Found
app.use((req, res, next) => {
        res.status(404).json({ error: 'Route not found' });
});

app.listen(3001, () => {
        console.log('Server listening on http://localhost:3001');
});
