import React, { useState, useEffect } from "react";
import Post from '../Post/Post';
import PostForm from '../Post/PostForm'; 
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]); // Boş dizi olarak başlatıyoruz

    const refreshPosts = () => {
        fetch("/posts")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("Gelen Postlar:", result); // Gelen verileri kontrol edin
                    setIsLoaded(true);
                    if (Array.isArray(result)) {
                        setPostList(result);
                    } else if (result.posts && Array.isArray(result.posts)) {
                        setPostList(result.posts);
                    } else {
                        console.error("Beklenmedik veri formatı", result);
                        setPostList([]); // Beklenmedik bir formatta veri geldiyse boş dizi atıyoruz
                    }
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    };
   
    useEffect(() => {
        refreshPosts(); // Bileşen yüklendiğinde postları getiriyoruz
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    backgroundColor: '#e3f2fd',
                    padding: '20px',
                    borderRadius: '8px'
                }}
            >
                <PostForm userId={1} userName={"ddd"} refreshPosts={refreshPosts} />
                {postList.map((post) => (
                    <Box key={post.id} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Post 
                            userId={post.userId} 
                            postId={post.id}  // Burada id'yi doğru geçiriyoruz.
                            userName={post.userName}
                            title={post.title} 
                            text={post.text} 
                            likes={post.postLikes || []} // likes bilgisi varsa gönderiyoruz, yoksa boş bir dizi veriyoruz. 
                        />
                    </Box>
                ))}
            </Container>
        );
    }
}

export default Home;
