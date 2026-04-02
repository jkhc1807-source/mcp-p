import React, { useState, useRef } from 'react';
import Layout from './Layout';
import PostDetailModal from '../components/common/PostDetailModal';
import { usePosts } from '../context/PostContext';
import './Page.css';

const Feed = () => {
  const { posts, addPost, likePost, addComment } = usePosts();
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showHeartId, setShowHeartId] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    const newPost = {
      id: Date.now(),
      user: 'PremiumUser',
      content: inputText,
      likes: 0,
      time: '방금 전',
      emoji: '🌟',
      image: selectedImage,
      comments: []
    };

    addPost(newPost);
    setInputText('');
    setSelectedImage(null);
  };

  const handleDoubleTap = (id) => {
    likePost(id);
    setShowHeartId(id);
    setTimeout(() => setShowHeartId(null), 800);
  };

  return (
    <Layout>
      <div className="feed-container">
        {/* Story Bar */}
        <div className="story-bar">
          {['Your Story', 'Design', 'React', 'Premium', 'UI', 'UX'].map((label, i) => (
            <div key={i} className="story-item" title={label}>
              <div className="story-circle" style={{background: `hsl(${i * 60}, 70%, 90%)`}}></div>
            </div>
          ))}
        </div>

        {/* Post Creator */}
        <div className="post-creator">
          <form onSubmit={handlePost}>
            {selectedImage && (
              <div className="upload-preview">
                <img src={selectedImage} alt="Preview" />
                <button type="button" className="btn-remove-preview" onClick={() => setSelectedImage(null)}>✕</button>
              </div>
            )}
            <div className="post-input-wrapper">
              <textarea 
                className="post-input" 
                placeholder="지금 무슨 생각을 하고 계신가요?" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              ></textarea>
              {inputText && (
                <button type="button" className="btn-clear" style={{opacity: 1}} onClick={() => setInputText('')}>X</button>
              )}
            </div>
            <div className="post-actions">
              <div style={{display: 'flex', gap: '1rem'}}>
                <button 
                  type="button" 
                  className="nav-icon-btn" 
                  onClick={() => fileInputRef.current.click()}
                  title="사진 추가"
                >🖼️</button>
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{padding: '0.6rem 1.5rem'}}>Post</button>
            </div>
          </form>
        </div>

        {/* Post List */}
        <div className="post-list">
          {posts.map(post => (
            <article key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-avatar"></div>
                <div className="post-user-info">
                  <strong>{post.user}</strong>
                  <span>{post.time}</span>
                </div>
              </div>
              
              <div 
                className="post-image-area" 
                onDoubleClick={() => handleDoubleTap(post.id)} 
                style={{cursor: 'pointer', position: 'relative'}}
              >
                {post.image ? (
                  <img src={post.image} alt="Post" className="post-image" />
                ) : (
                  <div className="post-image-placeholder">{post.emoji}</div>
                )}
                {showHeartId === post.id && (
                  <div className="heart-animation-container">
                    <span className="big-heart">❤️</span>
                  </div>
                )}
              </div>

              <div className="post-content">
                <div className="post-interactions">
                  <button className="interaction-btn" onClick={() => likePost(post.id)}>❤️</button>
                  <button className="interaction-btn" onClick={() => setSelectedPost(post)}>💬</button>
                  <button className="interaction-btn">✈️</button>
                </div>
                <div className="post-likes">
                  <strong style={{fontSize: '0.9rem'}}>좋아요 {post.likes}개</strong>
                </div>
                <div className="post-caption" onClick={() => setSelectedPost(post)} style={{cursor: 'pointer'}}>
                  <strong>{post.user}</strong> {post.content}
                </div>
                {post.comments && post.comments.length > 0 && (
                  <div 
                    style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', cursor: 'pointer'}}
                    onClick={() => setSelectedPost(post)}
                  >
                    댓글 {post.comments.length}개 모두 보기
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedPost && (
        <PostDetailModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
          onAddComment={addComment}
          onLike={likePost}
        />
      )}
    </Layout>
  );
};

export default Feed;
