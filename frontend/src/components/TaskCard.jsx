// src/components/TaskCard.js
import React from 'react';
import { Button, Card as MuiCard, CardContent, Typography } from '@mui/material';

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <MuiCard>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            WebkitLineClamp: 1, // Cha
          }}
        >
          {task.message}
        </Typography>
        <Typography color="textSecondary">
          Date & Time: {new Date(task.dateAndTime).toLocaleString()}
        </Typography>
        <Typography color="textSecondary">Number: {task.number}</Typography>
        <Typography color="textSecondary">Type: {task.type}</Typography>
        <Typography color="textSecondary">Status: {task.status}</Typography>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onEdit(task._id)}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: '#e3f2fd',
              },
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onDelete(task._id)}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: '#f8bbd0',
              },
            }}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </MuiCard>
  );
};

export default TaskCard;
