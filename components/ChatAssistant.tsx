import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { generateHealthResponse } from '../services/geminiService';

interface ChatProps {
  user: UserProfile;
}

const ChatAssistant: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: `Hi ${user.name}! I'm VitalSync, your health assistant. I can help with advice on workouts, diet, or general health questions. You can also show me pictures of food or ingredients!`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !attachedImage) return;

    const currentImage = attachedImage;
    const currentInput = input;
    
    // Clear inputs immediately
    setInput('');
    setAttachedImage(null);
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInput,
      image: currentImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Construct context from user profile
    const context = `User Profile: Age ${user.age}, Weight ${user.weight}kg, Goal: ${user.goal}.`;
    
    const responseText = await generateHealthResponse(userMsg.text, context, currentImage || undefined);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      alert("Your browser does not support voice input.");
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          🤖 VitalSync AI Assistant
        </h3>
        <span className="text-xs bg-emerald-500 px-2 py-1 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span> Online
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
            >
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="Uploaded attachment" 
                  className="mb-2 rounded-lg max-h-48 object-cover border border-white/20" 
                />
              )}
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Area */}
      {attachedImage && (
        <div className="px-4 pt-2 bg-white border-t border-gray-100 flex items-center gap-2">
          <div className="relative">
             <img src={attachedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
             <button 
                onClick={() => setAttachedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs shadow-sm"
             >
               ×
             </button>
          </div>
          <span className="text-xs text-gray-500">Image attached</span>
        </div>
      )}

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 items-end">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            title="Upload Image"
          >
            📷
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageSelect} 
          />
          
          <div className="flex-1 bg-gray-100 rounded-xl flex items-center pr-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Type or speak..."}
              className="flex-1 p-3 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={toggleListening}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-emerald-600'}`}
              title="Voice Input"
            >
              🎙️
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={isTyping || (!input.trim() && !attachedImage)}
            className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;