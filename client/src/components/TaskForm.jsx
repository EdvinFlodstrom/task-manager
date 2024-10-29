import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/taskSlice/actions';
import '../css/Button.css';
import '../css/TaskForm.css';

const TaskForm = ({ toggleForm }) => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [dueDate, setDueDate] = useState('');
        const [dueTime, setDueTime] = useState('');

        const dispatch = useDispatch();

        // Function to combine the due date and time, or use the one that is not empty.
        const formatDateAndTime = (date, time) => {
                if (!date && !time) {
                        return '';
                } else if (date && time) {
                        return new Date(`${dueDate}T${dueTime}`).toISOString();
                } else if (dueDate && !dueTime) {
                        return new Date(`${dueDate}`).toISOString();
                } else {
                        // Get the current date in 'yyyy-mm-dd' format
                        const today = new Date().toISOString().split('T')[0];
                        return new Date(`${today}T${dueTime}`).toISOString();
                }
        };

        const handleSubmit = (e) => {
                e.preventDefault();
                if (title) {
                        const dueDateAndTime = formatDateAndTime(
                                dueDate,
                                dueTime,
                        );

                        dispatch(
                                addTask({
                                        title,
                                        description,
                                        dueDate: dueDateAndTime,
                                }),
                        );
                        setTitle('');
                        setDescription('');
                        setDueDate('');
                        setDueTime('');

                        // Hide form after submitting task
                        toggleForm();
                }
        };

        return (
                <form onSubmit={handleSubmit} className='task-form'>
                        <input
                                type='text'
                                placeholder='Task title'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                        />
                        <textarea
                                placeholder='Task description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                        />
                        <input
                                type='date'
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                        />
                        <input
                                type='time'
                                value={dueTime}
                                onChange={(e) => setDueTime(e.target.value)}
                        />

                        <button type='submit' className='primary-button'>
                                Add Task
                        </button>
                </form>
        );
};

export default TaskForm;
