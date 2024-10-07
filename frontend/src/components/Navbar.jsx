import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#022b3a', boxShadow: 'none' }}>
      <Container>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#bfdbf7' }}>
            SMS & CALL
          </Typography>
          <div>
            <Button
              variant="contained"
              component={Link}
              to="/"
              sx={{
                marginRight: 2,
                backgroundColor: '#1f7a8c',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#bfdbf7',
                  color: '#022b3a',
                },
              }}
            >
              Create Task
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/showtask"
              sx={{
                backgroundColor: '#1f7a8c',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#bfdbf7',
                  color: '#022b3a',
                },
              }}
            >
              Show Tasks
            </Button>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
