import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/taskSlice/actions';
import '../css/TaskForm.css';

const TaskForm = () => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [dueDate, setDueDate] = useState('');

        const dispatch = useDispatch();

        const handleSubmit = (e) => {
                e.preventDefault();
                if (title) {
                        dispatch(
                                addTask({
                                        title,
                                        description,
                                        dueDate,
                                }),
                        );
                        setTitle('');
                        setDescription('');
                        setDueDate('');
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

                        <button type='submit'>Add Task</button>
                </form>
        );
};

export default TaskForm;
