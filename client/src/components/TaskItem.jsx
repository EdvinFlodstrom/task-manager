import React from 'react';
import { useDispatch } from 'react-redux';
import { updateTaskCompletion, deleteTask } from '../redux/taskSlice/actions';
import '../css/Button.css';
import '../css/TaskItem.css';

const TaskItem = ({ task }) => {
        const dispatch = useDispatch();

        const handleToggleComplete = () => {
                dispatch(
                        updateTaskCompletion({
                                id: task.id,
                                completed: !task.completed,
                        }),
                );
        };

        const handleDelete = () => {
                const now = Date.now();
                const taskDueDate = new Date(task.dueDate);

                // Ask the user if they really want to delete a task, the due date of which has yet to pass
                if (taskDueDate > now) {
                        const confirmDelete = window.confirm(
                                'This task is still upcoming. Are you sure you want to delete it?',
                        );

                        if (!confirmDelete) return;
                }

                dispatch(deleteTask(task.id));
        };

        const formatDateForDisplay = (isoDate) => {
                const date = new Date(isoDate);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                // Format as dd/mm-yyyy hh:mm
                return `${day}/${month}-${year} ${hours}:${minutes}`;
        };

        return (
                <div className='task-item'>
                        <button
                                className='warning-button task-delete-button'
                                onClick={handleDelete}
                        >
                                Delete
                        </button>
                        <div className='task-info'>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Due: {formatDateForDisplay(task.dueDate)}</p>
                        </div>
                        <input
                                type='checkbox'
                                className='task-completed-checkbox'
                                checked={task.completed}
                                onChange={handleToggleComplete}
                                style={{
                                        backgroundColor: task.completed
                                                ? `green`
                                                : `red`,
                                }}
                        />
                </div>
        );
};

export default TaskItem;
