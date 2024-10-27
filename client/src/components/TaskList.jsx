import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/taskSlice/actions';
import {
        selectAllTasks,
        selectLoadingStatus,
        selectError,
} from '../redux/taskSlice/selectors';
import TaskItem from './TaskItem';

const TaskList = () => {
        const dispatch = useDispatch();

        // Use dispatchors to access Redux state
        const tasks = useSelector(selectAllTasks);
        const loading = useSelector(selectLoadingStatus);
        const error = useSelector(selectError);

        useEffect(() => {
                dispatch(fetchTasks());
        }, [dispatch]);

        // TODO: Add options for sorting
        // Sort tasks by due date in ascending order
        const sortedTasks = tasks
                .slice()
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        return (
                <div className='task-list'>
                        {sortedTasks.map((task) => (
                                <TaskItem key={task.id} task={task} />
                        ))}
                </div>
        );
};

export default TaskList;
