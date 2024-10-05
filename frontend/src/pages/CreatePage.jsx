import React, { useState } from 'react';
import '../static/css/CreatePage.css'

function TaskForm() {
    const [newTask, setNewTask] = useState({
        dateAndTime: '',
        message: '',
        number: '',
        type: 'call', // Default value for type
    });

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewTask(prevTask => ({
            ...prevTask,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(newTask);
        // Reset form after submission
        setNewTask({
            dateAndTime: '',
            message: '',
            number: '',
            type: 'call',
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="dateAndTime">Date and Time:</label>
            <input
                type="datetime-local"
                name="dateAndTime"
                value={newTask.dateAndTime}
                onChange={handleChange}
                required
            />

            <label htmlFor="message">Message:</label>
            <textarea
                name="message"
                value={newTask.message}
                onChange={handleChange}
                placeholder="Enter your message"
                required
            />

            <label htmlFor="number">Number:</label>
            <input
                type="string"
                name="number"
                value={newTask.number}
                onChange={handleChange}
                placeholder="Enter a number"
                required
            />

            <label>
                <input
                    type="radio"
                    name="type"
                    value="call"
                    checked={newTask.type === 'call'}
                    onChange={handleChange}
                />
                Call
            </label>
            <label>
                <input
                    type="radio"
                    name="type"
                    value="message"
                    checked={newTask.type === 'message'}
                    onChange={handleChange}
                />
                Message
            </label>


            <button type="submit">Submit</button>
        </form>
    );
}

export default TaskForm;