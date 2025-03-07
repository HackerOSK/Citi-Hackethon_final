// CreditScoringChatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CreditScoringChatbot.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiSend, BiBot, BiUser, BiInfoCircle, BiArrowBack, BiDownload, BiX } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import { getCreditScore } from '../API/getCreditScore';
import { getSocialAnalysis } from '../API/getSocialAnalysis';
import { Squares } from '../components/Squares';

const CreditScoringChatbot = () => {
  const [businessId, setBusinessId] = useState('');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessData, setBusinessData] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [particles, setParticles] = useState([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  
  // Get credit score from location state if available
  const { creditScore, gstNumber, businessDetails, sentimentAnalysis } = location.state || {};

  // Initialize with GST number if available
  useEffect(() => {
    if (gstNumber) {
      setBusinessId(gstNumber);
      // Add initial welcome message
      setMessages([
        {
          role: 'system',
          content: 'Welcome to CreditAI Assistant! I can help you understand your credit score and provide financial advice.'
        }
      ]);
      
      // If credit score is available, add it to the messages
      if (creditScore) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: `I see your business has a credit score of ${creditScore}. ${getCreditScoreAnalysis(creditScore)}`
            }
          ]);
          
          // If sentiment analysis data is available, add it to the messages
          if (sentimentAnalysis) {
            setTimeout(() => {
              const sentimentSummary = getSentimentSummary(sentimentAnalysis);
              setMessages(prev => [
                ...prev,
                {
                  role: 'assistant',
                  content: sentimentSummary
                }
              ]);
            }, 1500);
          }
        }, 1000);
      }
    }
  }, [gstNumber, creditScore, sentimentAnalysis]);

  // Generate random particles for background effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
      setParticles(newParticles);
    };
    
    generateParticles();
    
    const moveParticles = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(p => ({
          ...p,
          x: (p.x + p.speedX + 100) % 100,
          y: (p.y + p.speedY + 100) % 100
        }))
      );
    }, 50);
    
    return () => clearInterval(moveParticles);
  }, []);

  // Helper function to get credit score analysis
  const getCreditScoreAnalysis = (score) => {
    if (score >= 750) {
      return "This is an excellent score! You're likely to qualify for the best loan terms and interest rates.";
    } else if (score >= 700) {
      return "This is a good score. You should qualify for most loans with competitive interest rates.";
    } else if (score >= 650) {
      return "This is a fair score. You may qualify for loans but might not get the best interest rates.";
    } else {
      return "This score could use some improvement. Let me help you understand how to improve it.";
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle business ID submission
  const handleBusinessIdSubmit = async () => {
    if (!businessId.trim()) return;
    
    setIsLoading(true);
    setShowWelcome(false);
    
    // Add user message
    setMessages([
      {
        role: 'system',
        content: 'Welcome to CreditAI Assistant! I can help you understand your credit score and provide financial advice.'
      }
    ]);
    
    try {
      // Fetch credit score
      let score = null;
      try {
        score = await getCreditScore(businessId);
        console.log("Credit Score:", score);
      } catch (creditError) {
        console.error("Error fetching credit score:", creditError);
      }
      
      // Fetch social analysis data
      let socialData = null;
      try {
        socialData = await getSocialAnalysis(businessId);
        console.log("Social Analysis Data:", socialData);
      } catch (socialError) {
        console.error("Error fetching social analysis data:", socialError);
      }
      
      setIsLoading(false);
      setBusinessData({
        name: 'Business with GST: ' + businessId,
        industry: 'Technology',
        foundedYear: 2018,
        creditScore: score,
        sentimentAnalysis: socialData
      });
      
      // Add bot response about finding the business
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I've found your business information. How can I help you today? You can ask about credit scores, loan eligibility, or financial advice.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      
      // If credit score is available, add it to the messages
      if (score) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: `I see your business has a credit score of ${score}. ${getCreditScoreAnalysis(score)}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          
          // If sentiment analysis data is available, add it to the messages
          if (socialData) {
            setTimeout(() => {
              const sentimentSummary = getSentimentSummary(socialData);
              setMessages(prev => [
                ...prev,
                {
                  role: 'assistant',
                  content: sentimentSummary,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }, 1500);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error in business ID submission:", error);
      setIsLoading(false);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I'm sorry, I encountered an error while retrieving your business information. Please try again later.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    const newUserMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsTyping(true);
    setShowQuickReplies(false);
    
    // Simulate AI response
    setTimeout(() => {
      const userInputLower = userInput.toLowerCase();
      let botResponse = '';
      let shouldShowQuickReplies = false;
      
      // Check for keywords in user input
      if (userInputLower.includes('credit score') || userInputLower.includes('score calculation')) {
        botResponse = 'Your credit score is calculated based on several factors:\n\n' +
          '1. Payment History (35%): Timely payments improve your score\n' +
          '2. Credit Utilization (30%): Lower is better, aim for under 30%\n' +
          '3. Credit History Length (15%): Longer history is better\n' +
          '4. Credit Mix (10%): Having different types of credit helps\n' +
          '5. New Credit Applications (10%): Too many recent applications can hurt your score';
        
        shouldShowQuickReplies = true;
      } 
      else if (userInputLower.includes('loan') || userInputLower.includes('borrow') || userInputLower.includes('finance')) {
        botResponse = 'Based on your profile, here are some loan options:\n\n' +
          '<div class="code-block">' +
          'Term Loan: 8-10% interest, 3-5 year term\n' +
          'Working Capital Loan: 10-12% interest, 1-3 year term\n' +
          'Equipment Financing: 7-9% interest, term based on asset life\n' +
          'Business Line of Credit: 9-11% interest, revolving credit' +
          '</div>\n\n' +
          'Would you like more details on any specific option?';
        
        shouldShowQuickReplies = true;
      }
      else if (userInputLower.includes('improve') || userInputLower.includes('increase') || userInputLower.includes('better')) {
        botResponse = 'Here are the top ways to improve your credit score:\n\n' +
          '• Pay all bills on time\n' +
          '• Reduce outstanding debt\n' +
          '• Keep credit card balances low\n' +
          '• Don\'t close old credit accounts\n' +
          '• Limit new credit applications\n' +
          '• Regularly check your credit report for errors';
      }
      else if (userInputLower.includes('interest rate') || userInputLower.includes('rate')) {
        botResponse = 'Interest rates for businesses with your profile typically range from 8% to 12% depending on the loan type and term. The better your credit score, the lower your interest rate will be.';
      }
      else if (userInputLower.includes('help') || userInputLower.includes('what can you do')) {
        botResponse = 'I can help you with:\n\n' +
          '• Understanding your credit score\n' +
          '• Providing loan options based on your profile\n' +
          '• Offering tips to improve your credit score\n' +
          '• Explaining financial terms and concepts\n\n' +
          'What would you like to know more about?';
        
        shouldShowQuickReplies = true;
      }
      else {
        botResponse = 'I understand you\'re asking about financial matters. Could you provide more details so I can give you a more specific answer?';
      }
      
      setMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      
      if (shouldShowQuickReplies) {
        setShowQuickReplies(true);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  // Handle quick reply selection
  const handleQuickReply = (reply) => {
    const newUserMessage = {
      role: 'user',
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setShowQuickReplies(false);
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let botResponse = '';
      
      switch(reply) {
        case 'How is my credit score calculated?':
          botResponse = 'Your credit score is calculated based on several factors:\n\n' +
            '1. Payment History (35%): Timely payments improve your score\n' +
            '2. Credit Utilization (30%): Lower is better, aim for under 30%\n' +
            '3. Credit History Length (15%): Longer history is better\n' +
            '4. Credit Mix (10%): Having different types of credit helps\n' +
            '5. New Credit Applications (10%): Too many recent applications can hurt your score';
          break;
        case 'How can I improve my score?':
          botResponse = 'Here are the top ways to improve your credit score:\n\n' +
            '• Pay all bills on time\n' +
            '• Reduce outstanding debt\n' +
            '• Keep credit card balances low\n' +
            '• Don\'t close old credit accounts\n' +
            '• Limit new credit applications\n' +
            '• Regularly check your credit report for errors';
          break;
        case 'What loan options are available?':
          botResponse = 'Based on your profile, here are some loan options:\n\n' +
            '<div class="code-block">' +
            'Term Loan: 8-10% interest, 3-5 year term\n' +
            'Working Capital Loan: 10-12% interest, 1-3 year term\n' +
            'Equipment Financing: 7-9% interest, term based on asset life\n' +
            'Business Line of Credit: 9-11% interest, revolving credit' +
            '</div>\n\n' +
            'Would you like more details on any specific option?';
          setShowQuickReplies(true);
          break;
        default:
          botResponse = 'I understand you\'re asking about financial matters. Could you provide more details so I can give you a more specific answer?';
      }
      
      setMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      
      setIsTyping(false);
    }, 1500);
  };

  // Format message content with code blocks
  const formatMessageContent = (content) => {
    if (content.includes('<div class="code-block">')) {
      const parts = content.split(/<div class="code-block">|<\/div>/);
      return (
        <>
          {parts.map((part, index) => {
            if (index % 2 === 0) {
              return <span key={index} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br/>') }} />;
            } else {
              return <div key={index} className="code-block" style={{ backgroundColor: '#1a202c' }}>{part}</div>;
            }
          })}
        </>
      );
    }
    return <span dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />;
  };

  // Go back to dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard', { 
      state: { 
        creditScore, 
        gstNumber 
      } 
    });
  };

  // Go to home page
  const handleGoToHome = () => {
    navigate('/');
  };

  // Go to GST verification page
  const handleGoToGSTVerification = () => {
    navigate('/gst-verification');
  };

  // Suggestions for the suggestion bar
  const suggestions = [
    "How is my credit score calculated?",
    "How can I improve my score?",
    "What loan options are available?",
    "What affects interest rates?",
    "How does GST compliance impact credit?",
    "What's a good debt-to-income ratio?"
  ];

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setUserInput(suggestion);
  };

  // Function to generate a summary of sentiment analysis
  const getSentimentSummary = (sentimentData) => {
    if (!sentimentData) return '';
    
    // Calculate average sentiment
    const sentiments = Object.values(sentimentData);
    const avgSentiment = sentiments.reduce((sum, val) => sum + val, 0) / sentiments.length;
    
    // Find highest and lowest sentiment platforms
    let highestPlatform = '';
    let highestValue = -1;
    let lowestPlatform = '';
    let lowestValue = 2;
    
    Object.entries(sentimentData).forEach(([platform, value]) => {
      if (value > highestValue) {
        highestValue = value;
        highestPlatform = platform;
      }
      if (value < lowestValue) {
        lowestValue = value;
        lowestPlatform = platform;
      }
    });
    
    // Generate summary
    let summary = `I've analyzed your business's social media sentiment:\n\n`;
    
    if (avgSentiment > 0.6) {
      summary += `Overall, your business has a positive reputation online (${(avgSentiment * 100).toFixed(0)}% positive).\n`;
    } else if (avgSentiment > 0.4) {
      summary += `Overall, your business has a neutral reputation online (${(avgSentiment * 100).toFixed(0)}% positive).\n`;
    } else {
      summary += `Overall, your business has some reputation challenges online (${(avgSentiment * 100).toFixed(0)}% positive).\n`;
    }
    
    summary += `Your strongest platform is ${highestPlatform} (${(highestValue * 100).toFixed(0)}% positive).\n`;
    
    if (lowestValue < 0.4) {
      summary += `You may want to address concerns on ${lowestPlatform} (${(lowestValue * 100).toFixed(0)}% positive).`;
    }
    
    return summary;
  };

  return (
    <Squares 
      speed={0.2} 
      squareSize={50}
      direction='diagonal'
      borderColor='rgba(59, 130, 246, 0.3)'
      hoverFillColor='rgba(139, 92, 246, 0.1)'
    >
      <motion.div 
        className="chatbot-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: '#111827' }}
      >
        {/* Professional Header with Breadcrumb Navigation */}
        <div className="chatbot-header">
          <div className="back-button" onClick={handleBackToDashboard}>
            <BiArrowBack size={18} />
            <span>Back</span>
          </div>
          <h2>CreditAI Assistant</h2>
        </div>
        
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <div className="breadcrumb-item">
            <span className="breadcrumb-link" onClick={handleGoToHome}>Home</span>
          </div>
          <div className="breadcrumb-item">
            <span className="breadcrumb-link" onClick={handleGoToGSTVerification}>GST Verification</span>
          </div>
          <div className="breadcrumb-item">
            <span className="breadcrumb-link" onClick={handleBackToDashboard}>Dashboard</span>
          </div>
          <div className="breadcrumb-item">
            <span className="breadcrumb-current">AI Assistant</span>
          </div>
        </div>
        
        {!businessData && (
          <motion.div 
            className="business-id-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input
              type="text"
              value={businessId}
              onChange={(e) => setBusinessId(e.target.value)}
              placeholder="Enter your GST Number"
              disabled={isLoading}
            />
            <button onClick={handleBusinessIdSubmit} disabled={!businessId.trim() || isLoading}>
              {isLoading ? 'Connecting...' : 'Start Chat'}
            </button>
          </motion.div>
        )}
        
        <div className="chat-messages">
          {/* Floating particles */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity
              }}
            />
          ))}
          
          <AnimatePresence>
            {showWelcome && !businessData && (
              <motion.div 
                className="welcome-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: '#e5e7eb',
                  backgroundColor: '#111827'
                }}
              >
                <BiBot size={60} style={{ margin: '0 auto 20px', color: '#8b5cf6' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Welcome to CreditAI Assistant
                </h3>
                <p style={{ marginBottom: '20px', color: '#9ca3af' }}>
                  I can help you understand your credit score, provide financial advice, and answer questions about loan eligibility.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                  <div style={{ background: '#1f2937', padding: '15px', borderRadius: '8px', width: '120px', textAlign: 'center' }}>
                    <BiInfoCircle size={24} style={{ margin: '0 auto 10px', color: '#3b82f6' }} />
                    <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Credit Advice</p>
                  </div>
                  <div style={{ background: '#1f2937', padding: '15px', borderRadius: '8px', width: '120px', textAlign: 'center' }}>
                    <BiDownload size={24} style={{ margin: '0 auto 10px', color: '#8b5cf6' }} />
                    <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Loan Options</p>
                  </div>
                  <div style={{ background: '#1f2937', padding: '15px', borderRadius: '8px', width: '120px', textAlign: 'center' }}>
                    <BiUser size={24} style={{ margin: '0 auto 10px', color: '#ec4899' }} />
                    <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Personalized</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`message ${message.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {message.role !== 'user' && (
                <div className={`avatar ${message.role}-avatar`}>
                  {message.role === 'assistant' ? <BiBot /> : <BiInfoCircle />}
                </div>
              )}
              <div className="message-content">
                {formatMessageContent(message.content)}
                {message.timestamp && (
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '5px', textAlign: message.role === 'user' ? 'right' : 'left' }}>
                    {message.timestamp}
                  </div>
                )}
                
                {/* Add reaction buttons to assistant messages */}
                {message.role === 'assistant' && (
                  <div className="message-reactions">
                    <button className="reaction-btn">👍</button>
                    <button className="reaction-btn">👎</button>
                    <button className="reaction-btn">🔄</button>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="avatar user-avatar">
                  <BiUser />
                </div>
              )}
            </motion.div>
          ))}
          
          {/* Quick reply buttons */}
          {showQuickReplies && !isTyping && (
            <motion.div 
              className="quick-replies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                className="quick-reply-btn"
                onClick={() => handleQuickReply('Tell me more about Term Loans')}
              >
                Term Loans
              </button>
              <button 
                className="quick-reply-btn"
                onClick={() => handleQuickReply('Tell me more about Working Capital Loans')}
              >
                Working Capital
              </button>
              <button 
                className="quick-reply-btn"
                onClick={() => handleQuickReply('Tell me more about Equipment Financing')}
              >
                Equipment Financing
              </button>
              <button 
                className="quick-reply-btn"
                onClick={() => handleQuickReply('Tell me more about Business Line of Credit')}
              >
                Line of Credit
              </button>
            </motion.div>
          )}
          
          {isTyping && (
            <motion.div 
              className="message assistant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="avatar bot-avatar">
                <BiBot />
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {businessData && (
          <>
            <div className="suggestion-bar">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(suggestion)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.div>
              ))}
            </div>
            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isTyping}
              />
              <motion.button 
                type="submit" 
                disabled={!userInput.trim() || isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BiSend size={20} />
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </Squares>
  );
};

export default CreditScoringChatbot;