import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
        fetchTasks,
        addTask,
        updateTaskCompletion,
        updateTaskDetails,
        deleteTask,
} from './actions';

// Helper function to update a task in the state
const updateTaskInState = (state, action) => {
        const taskIndex = state.tasks.findIndex(
                (task) => task.id === action.payload.id,
        );
        if (taskIndex >= 0) {
                state.tasks[taskIndex] = action.payload;
        }
};

const taskSlice = createSlice({
        name: 'tasks',
        initialState: {
                tasks: [],
                loading: false,
                error: { message: null, type: null },
        },
        reducers: {},
        extraReducers: (builder) => {
                builder.addCase(fetchTasks.pending, (state) => {
                        state.loading = true;
                })
                        .addCase(fetchTasks.fulfilled, (state, action) => {
                                state.loading = false;
                                state.tasks = action.payload;
                        })
                        .addCase(fetchTasks.rejected, (state, action) => {
                                state.loading = false;
                                state.error = action.error.message;
                        })
                        .addCase(addTask.fulfilled, (state, action) => {
                                state.tasks.push(action.payload);
                        })
                        .addCase(
                                updateTaskCompletion.fulfilled,
                                (state, action) => {
                                        updateTaskInState(state, action);
                                },
                        )
                        .addCase(
                                updateTaskDetails.fulfilled,
                                (state, action) => {
                                        updateTaskInState(state, action);
                                },
                        )
                        .addCase(deleteTask.fulfilled, (state, action) => {
                                state.tasks = state.tasks.filter(
                                        (task) => task.id !== action.payload,
                                );
                        })
                        .addMatcher(
                                isAnyOf(
                                        fetchTasks.rejected,
                                        addTask.rejected,
                                        updateTaskCompletion.rejected,
                                        updateTaskDetails.rejected,
                                        deleteTask.rejected,
                                ),
                                (state, action) => {
                                        state.loading = false;
                                        const actionType =
                                                action.type.split('/')[1];

                                        const backendErrorMessage =
                                                action.payload?.errors?.[0]
                                                        ?.msg ||
                                                action.error.message;

                                        state.error = {
                                                message:
                                                        backendErrorMessage ||
                                                        'An error occured',
                                                type: actionType,
                                        };
                                },
                        )
                        .addMatcher(
                                isAnyOf(
                                        fetchTasks.pending,
                                        addTask.pending,
                                        updateTaskCompletion.pending,
                                        updateTaskDetails.pending,
                                        deleteTask.pending,
                                ),
                                (state) => {
                                        state.error = {
                                                message: null,
                                                type: null,
                                        };
                                },
                        );
        },
});

export const selectError = (state) => state.tasks.error;
export default taskSlice.reducer;
