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
                // Ask the user if they really want to delete a task, the due date of which has yet to pass

                // Current time
                const currentTime = new Date();

                // Get task.dueDate and remove the trailing 'Z' to prevent JS from reading it as UTC
                // The time is converted in the backend
                // TODO: Find a less caveman-like solution to convert task.dueDate to a Date object without automatic timezone adjustments
                const taskDueDateString = task.dueDate.slice(0, -1);
                const taskDueDate = new Date(taskDueDateString);

                if (taskDueDate > currentTime) {
                        const confirmDelete = window.confirm(
                                'This task is still upcoming. Are you sure you want to delete it?',
                        );

                        if (!confirmDelete) return;
                }

                dispatch(deleteTask(task.id));
        };

        const formatDateForDisplay = (date) => {
                const [datePart, timePart] = date.split('T');
                const [year, month, day] = datePart.split('-');
                const [hour, minute] = timePart.split(':');

                // Format as dd/mm-yyyy hh:mm
                return `${day}/${month}-${year} ${hour}:${minute}`;
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
