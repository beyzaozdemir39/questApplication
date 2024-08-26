import React from "react";
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
    const userId = 5;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Link to={`/users/${userId}`} style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>User</Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;