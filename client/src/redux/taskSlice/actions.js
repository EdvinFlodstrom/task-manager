import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const tasksHttpAddress = 'http://localhost:3001/tasks';
const timezoneQuery = '?timezone=Europe/Stockholm';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
        const response = await axios.get(`${tasksHttpAddress}${timezoneQuery}`);
        return response.data;
});

export const addTask = createAsyncThunk(
        'tasks/addTask',
        async (task, { rejectWithValue }) => {
                try {
                        const response = await axios.post(
                                `${tasksHttpAddress}${timezoneQuery}`,
                                task,
                        );
                        return response.data;
                } catch (error) {
                        return rejectWithValue(error.response?.data);
                }
        },
);

export const updateTaskCompletion = createAsyncThunk(
        'tasks/updateTaskCompletion',
        async ({ id, completed }) => {
                const response = await axios.patch(
                        `${tasksHttpAddress}/${id}/completed${timezoneQuery}`,
                        { completed },
                );
                return response.data;
        },
);

export const updateTaskDetails = createAsyncThunk(
        'tasks/updateTaskDetails',
        async ({ id, details }) => {
                const response = await axios.patch(
                        `${tasksHttpAddress}/${id}/details${timezoneQuery}`,
                        details,
                );
                return response.data;
        },
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
        const response = await axios.delete(
                `${tasksHttpAddress}/${id}${timezoneQuery}`,
        );
        return id;
});
