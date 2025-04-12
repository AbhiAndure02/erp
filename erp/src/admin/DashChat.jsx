import React, { useState, useRef, useEffect } from 'react';
import { FaPaperclip, FaSmile, FaPaperPlane, FaEllipsisV } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import EmojiPicker from 'emoji-picker-react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { io } from 'socket.io-client';

const DashChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const socket = useRef();

  // Sample data for demonstration
  useEffect(() => {
    // Mock initial messages
    setMessages([
      {
        text: "Hey everyone! 👋 Welcome to our group chat!",
        sender: "admin",
        timestamp: new Date(Date.now() - 3600000),
        avatar: "A"
      },
      {
        text: "Excited to be here! 😊",
        sender: "user2",
        timestamp: new Date(Date.now() - 1800000),
        avatar: "B"
      },
      {
        text: "Just shared the project files with everyone",
        sender: "user3",
        timestamp: new Date(Date.now() - 900000),
        attachment: "https://example.com/file.pdf",
        avatar: "C"
      }
    ]);

    // Mock online users
    setOnlineUsers([
      { id: "user1", name: "Alex" },
      { id: "user2", name: "Bella" },
      { id: "user3", name: "Chris" },
      { id: "user4", name: "Dana" }
    ]);

    // In a real app, you would connect to your WebSocket server here
    // socket.current = io('http://localhost:5000');
    // socket.current.on('message', (message) => {
    //   setMessages(prev => [...prev, message]);
    // });
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    const messageData = {
      text: newMessage,
      sender: "currentUser",
      timestamp: new Date(),
      avatar: "Y"
    };

    if (previewUrl) {
      messageData.attachment = previewUrl;
    }

    // In a real app, you would send via WebSocket:
    // socket.current.emit('sendMessage', messageData);
    
    // For demo, just add to local state
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    setFile(null);
    setPreviewUrl('');
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For non-image files, just show a generic preview
      setPreviewUrl('https://cdn-icons-png.flaticon.com/512/136/136521.png');
    }
  };

  const onEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Sidebar */}
      <Sidebar variant="chat" />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 flex justify-between items-center text-white">
          <div>
            <h1 className="text-xl font-bold">Design Team Chat</h1>
            <p className="text-sm opacity-80">
              {onlineUsers.length} {onlineUsers.length === 1 ? 'member' : 'members'} online
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 4).map((user, index) => (
                <div 
                  key={index}
                  className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold text-sm shadow-md"
                  title={user.name}
                >
                  {user.name.charAt(0)}
                </div>
              ))}
            </div>
            <button className="p-1 rounded-full hover:bg-white/20">
              <FaEllipsisV />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/70 to-purple-50/50">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'currentUser' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender !== 'currentUser' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white flex items-center justify-center font-bold mr-2 mt-1 shadow">
                  {msg.avatar}
                </div>
              )}
              <div 
                className={`max-w-xs md:max-w-md rounded-xl p-4 ${msg.sender === 'currentUser' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-800 shadow'}`}
              >
                {msg.text && <p className="mb-1">{msg.text}</p>}
                {msg.attachment && (
                  <div className="mt-2 rounded-lg overflow-hidden">
                    {msg.attachment.includes('image') || msg.attachment.startsWith('data:image') ? (
                      <img 
                        src={msg.attachment} 
                        alt="Attachment" 
                        className="max-h-60 w-full object-cover"
                      />
                    ) : (
                      <div className="p-3 bg-white/20 rounded flex items-center">
                        <img 
                          src="https://cdn-icons-png.flaticon.com/512/136/136521.png" 
                          alt="File" 
                          className="w-8 h-8 mr-2"
                        />
                        <a 
                          href={msg.attachment} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium hover:underline"
                        >
                          Download File
                        </a>
                      </div>
                    )}
                  </div>
                )}
                <p className={`text-xs mt-2 ${msg.sender === 'currentUser' ? 'text-purple-100' : 'text-gray-500'}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input with floating emoji picker */}
        <div className="bg-white p-4 border-t border-purple-100 relative">
          {previewUrl && (
            <div className="relative mb-3 rounded-xl overflow-hidden shadow-md">
              <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-purple-700"
                onClick={() => {
                  setFile(null);
                  setPreviewUrl('');
                }}
              >
                ×
              </div>
              {previewUrl.includes('image') ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-40 w-full object-contain"
                />
              ) : (
                <div className="p-3 flex items-center bg-purple-50">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/136/136521.png" 
                    alt="File" 
                    className="w-10 h-10 mr-3"
                  />
                  <span className="text-purple-800 font-medium">Ready to send</span>
                </div>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-purple-600 hover:text-pink-500 transition-colors"
            >
              <FaSmile size={22} />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 z-10">
                <EmojiPicker 
                  onEmojiClick={onEmojiClick}
                  width={300}
                  height={400}
                  previewConfig={{ showPreview: false }}
                  theme="light"
                />
              </div>
            )}
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-purple-600 hover:text-pink-500 transition-colors"
            >
              <FaPaperclip size={22} />
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.zip"
            />
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your beautiful message..."
              className="flex-1 border border-purple-200 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-purple-50 placeholder-purple-300 text-purple-800"
            />
            
            <button 
              type="submit" 
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newMessage.trim() && !file}
            >
              <IoMdSend size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashChat;