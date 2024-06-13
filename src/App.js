import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const messagesEndRef = useRef(null);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  console.log(process.env)
  const handleSend = async () => {
    if (!input.trim()) return;

    const modifiedInput = selectedFeature ? `mode:${selectedFeature} query:${input}` : input;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.REACT_APP_API_KEY;



      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        { contents: [{ parts: [{ text: `Short answer, plain text, act like u are a motivational chat bot named MotiMate (kind of a counsellor) , Query: ${modifiedInput}` }] }] },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const botMessage = {
        sender: 'bot',
        text: response.data.candidates[0].content.parts[0].text
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Failed to fetch data. Please try again.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFeatureClick = (feature) => {
    setSelectedFeature((prevFeature) => (prevFeature === feature ? null : feature));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="container">
      <div className="side left">
        <div className="center-content ">
          <div className="company-name archivo-black-regular">MotiMate</div>
          <p className="company-description">MotiMate is your ally, supporting your journey with insights, encouragement, and unwavering positivity, powered by Google's Gemini AI</p>
          <p className="company-description">Choose MotiMate's default settings for a quick smile, or explore specialized modes for tailored inspiration and motivation, ensuring personalized support to brighten your day.</p>
          <p className="company-description">Made By Aryan Shivapuram</p>
        </div>
      </div>

      <div className="chat-interface">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender} ${message.sender === 'user' ? 'user-message' : ''}`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && <div className="message bot">Loading...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask MotiMate.."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
      <div className="side right">
        <div className="center-content features">
          <button
            className={`button ${selectedFeature === 'Compassion' ? 'selected' : ''}`}
            onClick={() => handleFeatureClick('Compassion')}
          >
            Compassion
          </button>
          <button
            className={`button ${selectedFeature === 'Happy' ? 'selected' : ''}`}
            onClick={() => handleFeatureClick('Happy')}
          >
            Happy
          </button>
          <button
            className={`button ${selectedFeature === 'Motivational' ? 'selected' : ''}`}
            onClick={() => handleFeatureClick('Motivational')}
          >
            Motivational
          </button>
          <button
            className={`button ${selectedFeature === 'Serenity' ? 'selected' : ''}`}
            onClick={() => handleFeatureClick('Serenity')}
          >
            Serenity
          </button>
          <button
            className={`button ${selectedFeature === 'Learning' ? 'selected' : ''}`}
            onClick={() => handleFeatureClick('Learning')}
          >
            Learning
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
