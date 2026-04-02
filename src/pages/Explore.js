import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import PostDetailModal from '../components/common/PostDetailModal';
import { usePosts } from '../context/PostContext';
import './Page.css';

const Explore = () => {
  const { posts, allPosts, likePost, addComment } = usePosts();
  const [selectedPost, setSelectedPost] = useState(null);
  const [displayPosts, setDisplayPosts] = useState([]);

  useEffect(() => {
    const mockExplorePosts = [
      { id: 'm1', user: 'Traveler', content: '멋진 풍경이네요! 🏔️', likes: 120, time: '1일 전', emoji: '🏔️', comments: [] },
      { id: 'm2', user: 'Foodie', content: '오늘 점심은 파스타 🍝', likes: 85, time: '3시간 전', emoji: '🍝', comments: [] },
      { id: 'm3', user: 'Coder', content: '코딩 중... 💻', likes: 230, time: '12시간 전', emoji: '💻', comments: [] },
      { id: 'm4', user: 'Artist', content: '새로운 캔버스 작업 🎨', likes: 450, time: '2일 전', emoji: '🎨', comments: [] },
      { id: 'm5', user: 'PhotoGrapher', content: 'Sunset magic 🌅', likes: 890, time: '5시간 전', emoji: '🌅', comments: [] },
      { id: 'm6', user: 'Nature', content: 'Forest walk 🌲', likes: 150, time: '1시간 전', emoji: '🌲', comments: [] },
      { id: 'm7', user: 'Architect', content: 'Modern design 🏛️', likes: 340, time: '4일 전', emoji: '🏛️', comments: [] },
      { id: 'm8', user: 'Chef', content: 'Secret recipe 👨‍🍳', likes: 560, time: '6시간 전', emoji: '👨‍🍳', comments: [] },
      { id: 'm9', user: 'Gamer', content: 'Game night! 🎮', likes: 110, time: '2시간 전', emoji: '🎮', comments: [] },
    ];

    setDisplayPosts([...posts, ...mockExplorePosts]);
  }, [posts]);

  return (
    <Layout>
      <div className="explore-container">
        <div className="explore-grid">
          {displayPosts.map((post, index) => (
            <div 
              key={`${post.id}-${index}`} 
              className={`grid-item ${index % 10 === 0 ? 'featured' : ''}`}
              onClick={() => setSelectedPost(post)}
            >
              {post.image ? (
                <img src={post.image} alt="Explore" />
              ) : (
                <div className="post-image-placeholder" style={{width: '100%', height: '100%', fontSize: '3rem'}}>
                  {post.emoji}
                </div>
              )}
              <div className="grid-overlay">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments ? post.comments.length : 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPost && (
        <PostDetailModal 
          post={allPosts.find(p => p.id === selectedPost.id) || selectedPost} 
          onClose={() => setSelectedPost(null)}
          onLike={likePost}
          onAddComment={addComment}
        />
      )}
    </Layout>
  );
};

export default Explore;
