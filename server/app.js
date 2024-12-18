import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import tasksRouter from './routes/tasks.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS config based on environment variable
const corsOptions = {
        origin: process.env.CORS_ALLOWED_ORIGIN,
};

app.use(cors(corsOptions));

app.use(helmet());

const limiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 30, // 30 hops/minute
        message: 'Too many requests. Please try again later',
});

// Apply rate limiting globally
app.use(limiter);

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
