import React, { useState } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, Container, Typography, Grid } from '@mui/material';
import { useTaskStore } from '../store/task';

function TaskForm() {
    const { createTask } = useTaskStore();
    
    const [newTask, setNewTask] = useState({
        dateAndTime: '',
        message: '',
        number: '',
        type: 'call', // Default value for type
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prevTask => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { success, message } = await createTask(newTask);
        console.log("success", success);
        console.log("message", message);

        // Reset form after submission
        setNewTask({
            dateAndTime: '',
            message: '',
            number: '',
            type: 'call',
        });
    };

    return (
        <Container sx={{ backgroundColor: '#e1e5f2', padding: '20px', borderRadius: '8px',marginTop:'10px' }}>
            <Typography variant="h4" gutterBottom style={{ color: '#022b3a', textAlign: 'center' }}>
                Create New Task
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="datetime-local"
                            name="dateAndTime"
                            value={newTask.dateAndTime}
                            onChange={handleChange}
                            required
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#ffffff',
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            name="message"
                            value={newTask.message}
                            onChange={handleChange}
                            label="Message"
                            placeholder="Enter your message"
                            required
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#ffffff',
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="text"
                            name="number"
                            value={newTask.number}
                            onChange={handleChange}
                            label="Number"
                            placeholder="Enter a number"
                            required
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#ffffff',
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormLabel>Type:</FormLabel>
                        <RadioGroup
                            row
                            name="type"
                            value={newTask.type}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="call" control={<Radio />} label="Call" />
                            <FormControlLabel value="sms" control={<Radio />} label="Message" />
                        </RadioGroup>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: '#1f7a8c',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#bfdbf7',
                                    color: '#022b3a',
                                },
                            }}
                            fullWidth
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Button
                variant="text"
                color="secondary"
                href="/showtask"
                style={{ marginTop: '16px', color: '#1f7a8c' }}
            >
            </Button>
        </Container>
    );
}

export default TaskForm;
