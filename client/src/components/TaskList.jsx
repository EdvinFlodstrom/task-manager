import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/taskSlice/actions';
import {
        selectAllTasks,
        selectLoadingStatus,
        selectError,
} from '../redux/taskSlice/selectors';
import TaskItem from './TaskItem';
import '../css/Button.css';
import '../css/TaskList.css';

const TaskList = () => {
        const dispatch = useDispatch();

        // Use dispatchors to access Redux state
        const tasks = useSelector(selectAllTasks);
        const loading = useSelector(selectLoadingStatus);
        const error = useSelector(selectError);

        // Fetch tasks immediately
        useEffect(() => {
                dispatch(fetchTasks());
        }, [dispatch]);

        // Funciton to re-fetch tasks
        const refreshTasks = () => {
                dispatch(fetchTasks());
        };

        // TODO: Add options for sorting
        // Sort tasks by due date in ascending order
        const sortedTasks = tasks
                .slice()
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        return (
                <>
                        <button
                                className='primary-button fetch-tasks-button'
                                onClick={refreshTasks}
                        >
                                Refresh Tasks
                        </button>
                        <div className='task-list'>
                                {sortedTasks.map((task) => (
                                        <TaskItem key={task.id} task={task} />
                                ))}
                        </div>
                </>
        );
};

export default TaskList;
