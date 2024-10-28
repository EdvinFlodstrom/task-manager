import React from 'react';
import TaskList from './components/TaskList';
import './css/App.css';

const App = () => {
        return (
                <div className='app-container'>
                        <h1>Tasks:</h1>

                        <TaskList />
                </div>
        );
};

export default App;
