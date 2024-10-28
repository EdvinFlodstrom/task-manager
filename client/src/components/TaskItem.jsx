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
                dispatch(deleteTask(task.id));
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
                                <p>Due: {task.dueDate}</p>
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
