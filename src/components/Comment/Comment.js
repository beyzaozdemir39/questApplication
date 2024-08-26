import React from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { CardContent, InputAdornment, OutlinedInput, Avatar } from "@mui/material";

const CommentContainer = styled(CardContent)(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(4),
    height: theme.spacing(4),
}));

const UserLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    boxShadow: "none",
    color: "white",
}));

function Comment({ text, userId, userName }) {
    const displayName = userName ? userName.charAt(0).toUpperCase() : "U"; // U yerine farklı bir varsayılan değer de kullanabilirsiniz.
    return (
        <CommentContainer>
            <OutlinedInput
                disabled
                id="outlined-adornment-amount"
                multiline
                inputProps={{ maxLength: 250 }}
                fullWidth
                value={text}
                startAdornment={
                    <InputAdornment position="start">
                        <UserLink to={`/users/${userId}`}>
                            <SmallAvatar aria-label="recipe">
                                {displayName}
                            </SmallAvatar>
                        </UserLink>
                    </InputAdornment>
                }
                sx={{ color: "black", backgroundColor: "white" }}
            />
        </CommentContainer>
    );
}

export default Comment;
