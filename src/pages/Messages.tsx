import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Message } from '../types/Message';
import { useAuth } from '../context/AuthContext';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'operator') {
      const interval = setInterval(fetchMessages, 5000);
      fetchMessages();
      return () => clearInterval(interval);
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get<Message[]>('/messages');
      setMessages(response.data);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch messages');
    }
  };

const sendMessage = async () => {
  if (user?.role === 'user') { // 改為 'user'
    try {
      await api.post('/messages', { receiverId, content });
      setContent('');
      fetchMessages();
    } catch (err: any) {
      setError('無法發送訊息');
    }
  }
};

const replyMessage = async (id: string, newContent: string) => {
  if (user?.role === 'operator') {
    try {
      await api.put(`/messages/${id}`, { content: newContent });
      fetchMessages();
    } catch (err: any) {
      setError('無法回覆訊息');
    }
  }
};

  const deleteMessage = async (id: string) => {
    if (user?.role === 'operator') {
      try {
        await api.delete(`/messages/${id}`);
        fetchMessages();
      } catch (err: any) {
        setError('Failed to delete message');
      }
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Messages</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user?.role === 'public' && (
        <div style={{ marginBottom: '20px' }}>
          <input
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            placeholder="Receiver ID"
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Message"
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button
            onClick={sendMessage}
            style={{ padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
          >
            Send
          </button>
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {messages.map((msg) => (
          <li key={msg._id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            {msg.content} (From: {msg.senderId})
            {user?.role === 'operator' && (
              <>
                <button
                  onClick={() => replyMessage(msg._id, 'Reply content')}
                  style={{ padding: '5px', marginLeft: '10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}
                >
                  Reply
                </button>
                <button
                  onClick={() => deleteMessage(msg._id)}
                  style={{ padding: '5px', marginLeft: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;