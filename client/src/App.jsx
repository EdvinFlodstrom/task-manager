import React from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './css/Button.css';
import './css/App.css';

const App = () => {
        return (
                <div className='app-container'>
                        <h1>Tasks:</h1>

                        <TaskForm />

                        <TaskList />
                </div>
        );
};

export default App;
