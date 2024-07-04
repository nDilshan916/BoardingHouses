import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import './Chat.css';

const socket = io("http://localhost:5000");

const ChatToHolder = () => {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = "currentUserId"; // Replace with the actual user ID logic
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/message/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.emit("joinRoom", { senderId: userId, receiverId });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [receiverId, userId, token]);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        `/api/message/send/${receiverId}`,
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      socket.emit("sendMessage", response.data);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (message) => {
    return message.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with Holder</h2>
      </div>
      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${msg.senderId === receiverId ? "received" : "sent"}`}
          >
            {formatMessage(msg.message)}
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
  
};

export default ChatToHolder;
