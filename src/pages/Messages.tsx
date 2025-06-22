import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Message } from '../types/Message';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [receiverId, setReceiverId] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const response = await api.get<Message[]>('/messages');
    setMessages(response.data);
  };

  const sendMessage = async () => {
    await api.post('/messages', { receiverId, content });
    fetchMessages();
  };

  const replyMessage = async (id: string, newContent: string) => {
    await api.put(`/messages/${id}`, { content: newContent });
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    await api.delete(`/messages/${id}`);
    fetchMessages();
  };

  return (
    <div>
      <input value={receiverId} onChange={(e) => setReceiverId(e.target.value)} placeholder="Receiver ID" />
      <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Message" />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg) => (
          <li key={msg._id}>
            {msg.content}
            <button onClick={() => replyMessage(msg._id, 'Reply content')}>Reply</button>
            <button onClick={() => deleteMessage(msg._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;