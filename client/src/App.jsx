import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './css/Button.css';
import './css/App.css';

const App = () => {
        const [showForm, setShowForm] = useState(false);

        const toggleForm = () => {
                setShowForm(!showForm);
        };

        return (
                <div className='app-container'>
                        <h1>Tasks:</h1>

                        <button className='primary-button' onClick={toggleForm}>
                                {showForm
                                        ? 'Hide Task Form'
                                        : 'Create New Task'}
                        </button>

                        {showForm && <TaskForm toggleForm={toggleForm} />}

                        <TaskList />
                </div>
        );
};

export default App;
