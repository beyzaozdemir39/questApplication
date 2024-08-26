import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { InputAdornment, OutlinedInput, Button, Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // MoreVertIcon import edilmesi gerekiyor

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PostForm({ userId, userName, refreshPosts }) {
    const [postTitle, setPostTitle] = useState("");
    const [postText, setPostText] = useState("");
    const [open, setOpen] = useState(false);

    const savePost = () => {
        fetch("/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: postTitle,
                userId: userId,
                text: postText,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data && data.id) { // Eğer backend'den gelen veri varsa ve id'yi içeriyorsa
                console.log("Post created:", data);
                refreshPosts();
                setOpen(true); // Snackbar'ı aç
            } else {
                console.error("Post oluşturulurken bir hata oluştu, dönen data:", data);
            }
        })
        .catch((err) => console.log("Error:", err));
    };
    

    const handleSubmit = () => {
        savePost();
        setPostTitle("");
        setPostText("");
    };

    const handleTitle = (value) => {
        setPostTitle(value);
    };

    const handleText = (value) => {
        setPostText(value);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Card 
            sx={{ 
                width: '100%', 
                maxWidth: { xs: '100%', sm: '90%', md: '75%', lg: '60%' }, 
                marginBottom: '16px', 
                boxShadow: 3 
            }}
        >
            <CardHeader
                avatar={
                    <Link 
                        to={`/users/${userId}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <Avatar sx={{ bgcolor: '#90caf9' }} aria-label="recipe">
                            {userName.charAt(0).toUpperCase()}
                        </Avatar>
                    </Link>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={<OutlinedInput
                    id="outlined-adornment-amount"
                    multiline
                    placeholder="title"
                    inputProps={{ maxLength: 25 }}
                    fullWidth
                    value={postTitle}
                    onChange={(i) => handleTitle(i.target.value)}
                />} 
            />
            <CardContent>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    multiline
                    placeholder="text"
                    inputProps={{ maxLength: 250 }}
                    fullWidth
                    value={postText}
                    onChange={(i) => handleText(i.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <Button 
                                variant="contained"
                                sx={{
                                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                    color: "white",
                                }}
                                onClick={handleSubmit}
                            >
                                Post
                            </Button>
                        </InputAdornment>
                    }
                /> 
            </CardContent>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Post created successfully!
                </Alert>
            </Snackbar>
        </Card>
    );
}

export default PostForm;
