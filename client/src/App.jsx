import React from 'react';
import TaskList from './components/TaskList';
import './css/App.css';

const App = () => {
        return (
                <div className='app-container'>
                        <h1>Task Manager</h1>
                        <button
                                className='fetch-tasks-button'
                                onClick={() => window.location.reload()}
                        >
                                Refresh Tasks
                        </button>
                        <TaskList />
                </div>
        );
};

export default App;
