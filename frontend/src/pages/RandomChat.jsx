import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import '../styles/RandomChat.css';

const SOCKET_SERVER_URL = 'http://localhost:5000';

export default function RandomChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef();
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    connectToRandomChat();
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const connectToRandomChat = () => {
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.emit('find_random');
    setConnected(true);
    setMessages([{ sender: 'system', text: 'Connecting to a stranger...' }]);

    socketRef.current.on('receive_message', (message) => {
      setMessages(prev => [...prev, { sender: 'stranger', ...message }]);
    });

    socketRef.current.on('system_message', (msg) => {
      setMessages(prev => [...prev, { sender: 'system', text: msg }]);
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const message = { type: 'text', text: input };
    setMessages([...messages, { sender: 'you', ...message }]);
    socketRef.current.emit('send_message', message);
    setInput('');
  };

  const handleSendImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;
      const message = { type: 'image', data: base64Image };
      setMessages([...messages, { sender: 'you', ...message }]);
      socketRef.current.emit('send_message', message);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleNext = () => {
    socketRef.current.disconnect();
    connectToRandomChat();
  };

  const handleCancel = () => {
    socketRef.current.disconnect();
    navigate('/');
  };

  return (
    <div className="chat-page">
      <h1>Random Chat</h1>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${
                msg.sender === 'you'
                  ? 'message-you'
                  : msg.sender === 'system'
                  ? 'message-system'
                  : 'message-stranger'
              }`}
            >
              {msg.type === 'image' ? (
                <img src={msg.data} alt="sent" />
              ) : (
                msg.text
              )}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>

          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            onChange={handleSendImage}
            style={{ display: 'none' }}
          />
          <label htmlFor="imageUpload" className="upload-btn">
            Upload Image
          </label>
        </div>

        <div className="action-buttons">
          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
