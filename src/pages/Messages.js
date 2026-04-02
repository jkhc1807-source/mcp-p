import React, { useState } from 'react';
import Layout from './Layout';
import './Page.css';

const Messages = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [inputText, setInputText] = useState('');
  const [chats, setChats] = useState([
    {
      id: 1,
      user: 'DesignMaster',
      lastMessage: '그 디자인 정말 마음에 들어요!',
      time: '12분 전',
      messages: [
        { id: 1, text: '안녕하세요! 새로 올리신 포스트 봤어요.', type: 'received' },
        { id: 2, text: '감사합니다! 파스텔 톤으로 신경 좀 썼죠. ㅎㅎ', type: 'sent' },
        { id: 3, text: '그 디자인 정말 마음에 들어요!', type: 'received' },
      ]
    },
    {
      id: 2,
      user: 'Traveler',
      lastMessage: '다음 여행지는 어디인가요?',
      time: '1시간 전',
      messages: [
        { id: 1, text: '사진 대박이네요 ㄷㄷ', type: 'received' },
        { id: 2, text: '다음 여행지는 어디인가요?', type: 'received' },
      ]
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      type: 'sent'
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: inputText,
          time: '방금 전'
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setInputText('');
  };

  const currentChat = chats.find(c => c.id === activeChat);

  return (
    <Layout>
      <div className="messages-container">
        <div className="dm-wrapper">
          {/* Sidebar */}
          <div className="dm-sidebar">
            <div className="dm-sidebar-header">
              <span>PremiumUser</span>
            </div>
            <div className="dm-user-list">
              {chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`dm-user-item ${activeChat === chat.id ? 'active' : ''}`}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <div className="post-avatar" style={{width: '56px', height: '56px', background: chat.id === 1 ? '#e0e7ff' : '#ffd1dc'}}></div>
                  <div className="dm-user-info">
                    <strong>{chat.user}</strong>
                    <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{chat.lastMessage} · {chat.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="dm-chat-window">
            {currentChat ? (
              <>
                <div className="dm-chat-header">
                  <div className="post-avatar" style={{width: '24px', height: '24px', background: currentChat.id === 1 ? '#e0e7ff' : '#ffd1dc'}}></div>
                  <strong>{currentChat.user}</strong>
                </div>
                <div className="dm-messages-area">
                  {currentChat.messages.map(msg => (
                    <div key={msg.id} className={`chat-bubble ${msg.type}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="dm-input-area">
                  <form className="dm-input-wrapper" onSubmit={handleSendMessage}>
                    <input 
                      type="text" 
                      className="comment-input" 
                      placeholder="메시지 입력..." 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    {inputText && (
                      <button type="button" className="btn-clear" onClick={() => setInputText('')}>X</button>
                    )}
                    <button type="submit" className="btn-post-comment" disabled={!inputText.trim()}>보내기</button>
                  </form>
                </div>
              </>
            ) : (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)'}}>
                대화를 선택하세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
