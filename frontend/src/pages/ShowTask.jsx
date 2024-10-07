import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../store/task';
import {
  Grid,
  Paper,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import TaskCard from '../components/TaskCard';
import { Link } from 'react-router-dom';

const ShowTask = () => {
  const { showAllTask, tasks, deleteTask, updateTask } = useTaskStore();
  const [open, setOpen] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchTasks = async () => {
      await showAllTask();
      setLoading(false); // Set loading to false after tasks are fetched
    };

    fetchTasks();
  }, [showAllTask]);

  const handleEdit = (task) => {
    const localDate = new Date(task.dateAndTime);
    const formattedDate = localDate.toISOString().slice(0, 16); // Format to "yyyy-MM-ddThh:mm"

    setUpdatedTask({
      ...task,
      dateAndTime: formattedDate,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...updatedTask,
      dateAndTime: new Date(updatedTask.dateAndTime).toISOString(), // Ensure it's in the correct format
    };

    const { success, message } = await updateTask(updatedTask._id, updatedData);
    console.log(success ? "Updated" : "Failed to update", message);
    handleClose(); // Close the modal after submission
    alert("Task Updated successfully")
  };

  const handleDeleteTask = async (tid) => {
    const result = await deleteTask(tid) || {};
    const { success, message } = result;

    console.log("success", success, "message", message);
    if (!success) {
      console.log("Task is not deleted");
    } else {
      console.log("Deleted");
      alert("Task Deleted successfully")

    }
  };

  if (loading) {
    return <Typography variant="h6" style={{ textAlign: 'center' }}>Loading tasks...</Typography>;
  }

  return (
    <Container sx={{ backgroundColor: '#e1e5f2', padding: '20px', borderRadius: '8px', marginTop: '10px' }}>
      <Typography variant="h4" style={{ textAlign: 'center', color: '#022b3a', marginBottom: '20px' }}>
        Task List
      </Typography>
      <Grid container spacing={2}>
        {tasks && tasks.length > 0 ? (
          tasks.map(task => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px', backgroundColor: '#ffffff' }}>
                <TaskCard
                  task={task}
                  onEdit={() => handleEdit(task)}
                  onDelete={handleDeleteTask}
                />
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px', backgroundColor: '#ffffff' }}>
              <Typography variant="h6">No tasks found.</Typography>
              <Typography variant="body1" style={{ margin: '16px 0' }}>
                It looks like you don't have any tasks yet!
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#1f7a8c',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#bfdbf7',
                    color: '#022b3a',
                  },
                  textTransform: 'none',
                }}
                component={Link}
                to="/"
              >
                Create Task
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Update Task Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ backgroundColor: '#022b3a', color: '#fff' }}>Update Task</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#e1e5f2' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="datetime-local"
              name="dateAndTime"
              value={updatedTask.dateAndTime}
              onChange={handleChange}
              required
              sx={{ marginBottom: '16px' }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              name="message"
              value={updatedTask.message}
              onChange={handleChange}
              label="Message"
              placeholder="Enter your message"
              required
              sx={{ marginBottom: '16px' }}
            />
            <TextField
              fullWidth
              type="text"
              name="number"
              value={updatedTask.number}
              onChange={handleChange}
              label="Number"
              placeholder="Enter a number"
              required
              sx={{ marginBottom: '16px' }}
            />
            <FormControl component="fieldset" sx={{ marginBottom: '16px' }}>
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup
                row
                name="type"
                value={updatedTask.type}
                onChange={handleChange}
              >
                <FormControlLabel value="call" control={<Radio />} label="Call" />
                <FormControlLabel value="sms" control={<Radio />} label="Message" />
              </RadioGroup>
            </FormControl>
            <DialogActions>
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
              >
                Update Task
              </Button>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ShowTask;
