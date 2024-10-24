import express from 'express';
import tasksRouter from './routes/tasks.js';

const app = express();

app.use(express.json());

app.use('/tasks', tasksRouter);

app.listen(3001, () => {
        console.log('Server listening on http://localhost:3001');
});
