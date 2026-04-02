import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import PostDetailModal from '../components/common/PostDetailModal';
import { usePosts } from '../context/PostContext';
import './Page.css';

const Profile = () => {
  const { allPosts, likePost, addComment } = usePosts();
  const [profile, setProfile] = useState({
    username: 'PremiumUser',
    name: '프리미엄 사용자',
    bio: '리액트와 파스텔 디자인을 사랑하는 개발자입니다. ✨',
    avatar: null
  });
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editInfo, setEditInfo] = useState({ ...profile });

  const myPosts = allPosts.filter(p => p.user === 'PremiumUser');

  useEffect(() => {
    const savedProfile = localStorage.getItem('premium-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setEditInfo(JSON.parse(savedProfile));
    }
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(editInfo);
    localStorage.setItem('premium-profile', JSON.stringify(editInfo));
    setIsEditModalOpen(false);
  };

  return (
    <Layout>
      <div className="profile-container">
        {/* Profile Header */}
        <header className="profile-header">
          <div className="profile-image-section">
            <div className="profile-image-large">
              <div></div>
            </div>
          </div>
          
          <div className="profile-info-section">
            <div className="profile-name-row">
              <h2 className="profile-username">{profile.username}</h2>
              <button className="btn-edit-profile" onClick={() => setIsEditModalOpen(true)}>프로필 편집</button>
            </div>
            
            <div className="profile-stats-row">
              <div className="stat-item"><span className="stat-count">{myPosts.length}</span><span className="stat-label">게시물</span></div>
              <div className="stat-item"><span className="stat-count">128</span><span className="stat-label">팔로워</span></div>
              <div className="stat-item"><span className="stat-count">256</span><span className="stat-label">팔로잉</span></div>
            </div>
            
            <div className="profile-bio">
              <strong>{profile.name}</strong>
              <p>{profile.bio}</p>
            </div>
          </div>
        </header>

        {/* Post Grid */}
        <div className="profile-grid">
          {myPosts.map(post => (
            <div key={post.id} className="grid-item" onClick={() => setSelectedPost(post)}>
              {post.image ? (
                <img src={post.image} alt="Post" />
              ) : (
                <div className="post-image-placeholder" style={{width: '100%', height: '100%', fontSize: '2rem'}}>
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-container" style={{maxWidth: '500px', gridTemplateColumns: '1fr'}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{margin: 0}}>프로필 편집</h3>
              <button className="btn-clear" style={{position: 'static', opacity: 1}} onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <form className="edit-form" onSubmit={handleSaveProfile}>
              <div className="edit-field">
                <label>이름</label>
                <input 
                  type="text" 
                  className="edit-input" 
                  value={editInfo.name} 
                  onChange={(e) => setEditInfo({...editInfo, name: e.target.value})}
                />
              </div>
              <div className="edit-field">
                <label>소개</label>
                <textarea 
                  className="edit-input" 
                  rows="3"
                  value={editInfo.bio} 
                  onChange={(e) => setEditInfo({...editInfo, bio: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>저장</button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedPost && (
        <PostDetailModal 
          post={allPosts.find(p => p.id === selectedPost.id)} 
          onClose={() => setSelectedPost(null)}
          onLike={likePost}
          onAddComment={addComment}
        />
      )}
    </Layout>
  );
};

export default Profile;
