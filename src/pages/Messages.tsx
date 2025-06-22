import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Message } from '../types/Message';
import { useAuth } from '../context/AuthContext';
import { Button, Typography, TextField, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Container, Alert } from '@mui/material';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  useEffect(() => {
    if (user?.role === 'user' || user?.role === 'operator') {
      const interval = setInterval(fetchMessages, 5000);
      fetchMessages();
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const response = await api.get<Message[]>('/messages');
      setMessages(response.data);
      setError(null);
    } catch (err: any) {
      setError('加載消息失敗');
    }
  };

  const sendMessage = async () => {
    if (user?.role === 'user') {
      try {
        await api.post('/messages', { receiverId, content });
        setContent('');
        setReceiverId('');
        fetchMessages();
      } catch (err: any) {
        setError('發送消息失敗');
      }
    }
  };

  const replyMessage = async () => {
    if (replyTo && user?.role === 'operator') {
      try {
        await api.put(`/messages/${replyTo._id}`, { content: reply });
        setReply('');
        setReplyTo(null);
        fetchMessages();
      } catch (err: any) {
        setError('回复消息失敗');
      }
    }
  };

  const deleteMessage = async (id: string) => {
    if (user?.role === 'operator') {
      try {
        await api.delete(`/messages/${id}`);
        fetchMessages();
      } catch (err: any) {
        setError('刪除消息失敗');
      }
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4">消息</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {user?.role === 'user' && (
        <div style={{ marginBottom: '20px' }}>
          <TextField label="接收者 ID" value={receiverId} onChange={(e) => setReceiverId(e.target.value)} sx={{ mr: 1 }} />
          <TextField label="消息內容" value={content} onChange={(e) => setContent(e.target.value)} sx={{ mr: 1 }} />
          <Button variant="contained" onClick={sendMessage}>發送</Button>
        </div>
      )}
      <List>
        {messages.map((msg) => (
          <ListItem key={msg._id}>
            <ListItemText primary={msg.content} secondary={`從 ${msg.senderId} 發送於 ${msg.timestamp}`} />
            {user?.role === 'operator' && (
              <>
                <Button onClick={() => setReplyTo(msg)}>回复</Button>
                <Button onClick={() => deleteMessage(msg._id)}>刪除</Button>
              </>
            )}
          </ListItem>
        ))}
      </List>
      <Dialog open={!!replyTo} onClose={() => setReplyTo(null)}>
        <DialogTitle>回复消息</DialogTitle>
        <DialogContent>
          <TextField label="回复內容" value={reply} onChange={(e) => setReply(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={replyMessage}>提交</Button>
          <Button onClick={() => setReplyTo(null)}>取消</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Messages;