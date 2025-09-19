"use client";
import { useState, useEffect, useRef } from "react";
import { RiRobot3Fill, RiUser3Line } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "user",
      parts: [
        {
          text: "I want you to work as ai customer support for an ecommerce website. Your name is Kato.",
        },
      ],
    },
    {
      role: "model",
      parts: [{ text: "Hello there! I'm Kato, your AI customer support assistant! 👋 How can I help you today?" }],
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (inputMsg.trim().length === 0) return;
    
    setLoading(true);
    setMessages([...messages, {role: "user", parts: [{text: inputMsg}]}]);
    const currentInput = inputMsg;
    setInputMsg("");
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({history : messages, message: currentInput }),
      });
      const data = await res.json();
      setMessages((message) => [...message, {role: "model", parts: [{text: data.message}]}]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((message) => [...message, {role: "model", parts: [{text: "Sorry, I'm having trouble connecting right now. Please try again."}]}]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <RiRobot3Fill className="text-3xl text-white" />
            <h1 className="text-2xl font-bold text-white">Kato AI Support</h1>
          </div>
          <p className="text-blue-100 text-sm">Your friendly ecommerce assistant</p>
        </div>
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, i) => i > 0 && (
            <div key={i} className={`flex ${message.role === "model" ? "justify-start" : "justify-end"} w-full`}>
              <div className={`flex items-end space-x-2 max-w-xs md:max-w-md lg:max-w-lg ${message.role === "model" ? "flex-row" : "flex-row-reverse space-x-reverse"}`}>
                
                {/* Avatar */}
                {message.role === "model" ? (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                    <RiRobot3Fill className="text-white text-sm" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                    <RiUser3Line className="text-white text-sm" />
                  </div>
                )}
                
                {/* Message Bubble */}
                {message.parts.map((part, j) => (
                  <div
                    key={j}
                    className={`
                      px-4 py-3 rounded-2xl shadow-lg
                      ${message.role === "model" 
                        ? "bg-white/90 text-gray-800 rounded-bl-sm" 
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm"
                      }
                    `}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {part.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Loading Animation */}
          {loading && (
            <div className="flex justify-start w-full">
              <div className="flex items-end space-x-2 max-w-xs">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                  <RiRobot3Fill className="text-white text-sm" />
                </div>
                <div className="bg-white/90 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-6 bg-white/5 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <textarea
                className="w-full p-4 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Type your message..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="1"
                style={{ minHeight: '52px', maxHeight: '120px' }}
              />
            </div>
            <button 
              className={`
                p-3 rounded-xl transition-all duration-200 flex items-center justify-center
                ${inputMsg.trim().length > 0 && !loading
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105" 
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }
              `}
              disabled={inputMsg.trim().length === 0 || loading}
              onClick={sendMessage}
            >
              <IoIosSend className="text-xl" />
            </button>
          </div>
          
          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Powered by AI • Type your question and press Enter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}