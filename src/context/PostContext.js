import React, { createContext, useContext, useState, useEffect } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedPosts = localStorage.getItem('premium-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const defaultPosts = [
        {
          id: 1,
          user: 'DesignMaster',
          content: '파스텔 톤의 새로운 디자인 시스템을 적용해 보았습니다. 어떤가요? 🎨',
          likes: 24,
          time: '2시간 전',
          emoji: '✨',
          image: null,
          comments: [{ user: 'ReactExpert', text: '정말 깔끔하네요!' }]
        },
        {
          id: 2,
          user: 'ReactLover',
          content: '리액트의 상태 관리로 구현하는 실시간 피드는 정말 강력하네요! 🚀',
          likes: 15,
          time: '5시간 전',
          emoji: '💻',
          image: null,
          comments: []
        }
      ];
      setPosts(defaultPosts);
      localStorage.setItem('premium-posts', JSON.stringify(defaultPosts));
    }
  }, []);

  const addPost = (newPost) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('premium-posts', JSON.stringify(updated));
  };

  const likePost = (id) => {
    const updated = posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
    setPosts(updated);
    localStorage.setItem('premium-posts', JSON.stringify(updated));
  };

  const addComment = (postId, comment) => {
    const updated = posts.map(p => p.id === postId ? { 
      ...p, 
      comments: [...(p.comments || []), { user: 'PremiumUser', text: comment }] 
    } : p);
    setPosts(updated);
    localStorage.setItem('premium-posts', JSON.stringify(updated));
  };

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PostContext.Provider value={{ 
      posts: filteredPosts, 
      allPosts: posts,
      addPost, 
      likePost, 
      addComment, 
      searchTerm, 
      setSearchTerm 
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);
