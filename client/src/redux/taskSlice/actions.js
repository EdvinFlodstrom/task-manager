import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const tasksHttpAddress = 'http://localhost:3001/tasks';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
        const response = await axios.get(tasksHttpAddress);
        return response.data;
});

export const addTask = createAsyncThunk('tasks/addTask', async (task) => {
        const response = await axios.post(tasksHttpAddress, task);
        return response.data;
});

export const updateTaskCompletion = createAsyncThunk(
        'tasks/updateTaskCompletion',
        async ({ id, completed }) => {
                const response = await axios.patch(
                        `${tasksHttpAddress}/${id}/completed`,
                        { completed },
                );
                return response.data;
        },
);

export const updateTaskDetails = createAsyncThunk(
        'tasks/updateTaskDetails',
        async ({ id, details }) => {
                const response = await axios.patch(
                        `${tasksHttpAddress}/${id}/details`,
                        details,
                );
                return response.data;
        },
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
        const response = await axios.delete(`${tasksHttpAddress}/${id}`);
        return response.data;
});
