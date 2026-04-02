import React, { useState } from 'react';

const PostDetailModal = ({ post, onClose, onAddComment, onLike }) => {
  const [comment, setComment] = useState('');

  if (!post) return null;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddComment(post.id, comment);
    setComment('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close-btn" onClick={onClose}>✕</button>
      
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-image-side">
          {post.image ? (
            <img src={post.image} alt="Post" />
          ) : (
            <div className="post-image-placeholder" style={{width: '100%', height: '100%', fontSize: '4rem'}}>
              {post.emoji}
            </div>
          )}
        </div>

        <div className="modal-content-side">
          <div className="modal-header">
            <div className="post-avatar"></div>
            <div className="post-user-info">
              <strong>{post.user}</strong>
              <span>{post.time}</span>
            </div>
          </div>

          <div className="modal-comments">
            <div className="comment-item">
              <div className="post-avatar" style={{width: '32px', height: '32px'}}></div>
              <div className="comment-text">
                <p><strong>{post.user}</strong> {post.content}</p>
              </div>
            </div>
            
            {post.comments && post.comments.map((c, idx) => (
              <div key={idx} className="comment-item">
                <div className="post-avatar" style={{width: '32px', height: '32px', background: 'var(--glass)'}}></div>
                <div className="comment-text">
                  <p><strong>{c.user}</strong> {c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <div className="post-interactions">
              <button className="interaction-btn" onClick={() => onLike(post.id)}>❤️</button>
              <button className="interaction-btn">💬</button>
              <button className="interaction-btn">✈️</button>
            </div>
            <div className="post-likes">
              <strong style={{fontSize: '0.9rem'}}>좋아요 {post.likes}개</strong>
            </div>
            
            <form className="comment-input-area" onSubmit={handleSubmitComment}>
              <input 
                type="text" 
                className="comment-input" 
                placeholder="댓글 달기..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn-post-comment" 
                disabled={!comment.trim()}
              >게시</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
