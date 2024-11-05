// pages/index.js
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001');

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('previousMessages', (messages) => {
      setMessages(messages);
    });

    return () => {
      socket.off('message');
      socket.off('previousMessages');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', { sender: username, content: message });
    setMessage('');
  };

  const register = async () => {
    await axios.post('http://localhost:3001/register', { username, password });
    alert('User registered');
  };

  const login = async () => {
    try {
      await axios.post('http://localhost:3001/login', { username, password });
      setLoggedIn(true);
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      {!loggedIn ? (
        <div>
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
          <button onClick={register}>Register</button>
        </div>
      ) : (
        <div>
          <h1>Real-Time Chat</h1>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
    }
              
