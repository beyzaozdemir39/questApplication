import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled, Container, TextField, Button } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import Comment from "../Comment/Comment";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Post({ title, text, userId, userName, postId, likes }) {
  const [expanded, setExpanded] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length); // Like sayısını yönetmek için state ekledik
  const isInitialMount = useRef(true);

  const refreshComments = useCallback(() => {
    if (!postId) {
      console.error("Post ID is undefined");
      return;
    }

    fetch(`/comments?postId=${postId}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (Array.isArray(result)) {
            setCommentList(result);
          } else {
            setCommentList([]);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [postId]);

  const handleCommentSubmit = () => {
    console.log("Yorum ekleniyor, Post ID:", postId);
    fetch("/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokenKey")}`,
      },
      body: JSON.stringify({
        postId: postId,
        text: commentText,
        userId: userId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setCommentText("");
        refreshComments();
      })
      .catch((err) => console.log("Error:", err.message));
  };

  const handleLike = () => {
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setLikeCount((prev) => (newLikeStatus ? prev + 1 : prev - 1));

    // Beğeni durumunu sunucuya gönder
    fetch("/likes", {
      method: newLikeStatus ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokenKey")}`,
      },
      body: JSON.stringify({
        postId: postId,
        userId: userId,
      }),
    }).catch((err) => console.log("Error:", err.message));
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
    if (!expanded) refreshComments();
  };

  const checkLikes = () => {
    var likeControl = likes.find((like) => like.userId === userId);
    if (likeControl != null) setIsLiked(true);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else refreshComments();
  }, [commentList]);

  useEffect(() => {
    console.log("Post ID:", postId); // Post ID'yi kontrol et
    checkLikes();
  }, [postId]);

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "600px",
        marginBottom: "16px",
        boxShadow: 3,
      }}
    >
      <CardHeader
        avatar={
          <Link to={`/users/${userId}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Avatar sx={{ bgcolor: "#90caf9" }} aria-label="recipe">
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </Link>
        }
        
        title={title}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike} aria-label="add to favorites">
          <FavoriteIcon style={isLiked ? { color: "red" } : null} />
        </IconButton>
        {likeCount}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <CommentIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Container fixed sx={{ marginTop: 2 }}>
          {error
            ? `Error: ${error.message}`
            : isLoaded
            ? commentList.length > 0
              ? commentList.map((comment) => (
                  <Comment key={comment.id} userId={comment.userId} userName={comment.userName} text={comment.text} />
                ))
              : "No comments yet."
            : "Loading..."}
          <TextField
            label="Comment Text"
            multiline
            fullWidth
            variant="outlined"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button onClick={handleCommentSubmit} variant="contained" color="primary">
            Send
          </Button>
        </Container>
      </Collapse>
    </Card>
  );
}

export default Post;
