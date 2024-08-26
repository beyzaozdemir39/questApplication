import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { CardContent, InputAdornment, OutlinedInput, Avatar, Button } from "@mui/material";
import { PostWithAuth, RefreshToken } from "../../services/HttpService";

// Styled components API ile stil oluşturma
const CommentSection = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "center",
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
}));

const StyledLink = styled(Link)({
  textDecoration: "none",
  boxShadow: "none",
  color: "white",
});

function CommentForm(props) {
  const { userId, userName, postId, setCommentRefresh } = props;
  const [text, setText] = useState("");

  let navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("tokenKey");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("refreshKey");
    localStorage.removeItem("userName");
    navigate(0);
  };

  const saveComment = () => {
    PostWithAuth("/comments", {
      postId: postId,
      userId: userId,
      text: text,
    })
      .then((res) => {
        if (!res.ok) {
          RefreshToken()
            .then((res) => {
              if (!res.ok) {
                logout();
              } else {
                return res.json();
              }
            })
            .then((result) => {
              console.log(result);

              if (result !== undefined) {
                localStorage.setItem("tokenKey", result.accessToken);
                saveComment();
                setCommentRefresh();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = () => {
    saveComment();
    setText("");
    setCommentRefresh();
  };

  const handleChange = (value) => {
    setText(value);
  };

  return (
    <CommentSection>
      <OutlinedInput
        id="outlined-adornment-amount"
        multiline
        inputProps={{ maxLength: 250 }}
        fullWidth
        onChange={(i) => handleChange(i.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <StyledLink to={`/users/${userId}`}>
              <SmallAvatar aria-label="recipe">
                {userName.charAt(0).toUpperCase()}
              </SmallAvatar>
            </StyledLink>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Button
              variant="contained"
              style={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
              }}
              onClick={handleSubmit}
            >
              Comment
            </Button>
          </InputAdornment>
        }
        value={text}
        style={{ color: "black", backgroundColor: 'white' }}
      />
    </CommentSection>
  );
}

export default CommentForm;
