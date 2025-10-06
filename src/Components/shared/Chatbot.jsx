"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { MessageCircle, X, Send, User, Sparkles } from "lucide-react";

const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const STORAGE_KEY = "chatMessages";
  const EXPIRY_TIME = 5 * 60 * 1000; // Save messages 5 min

  // Load messages
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedTime = localStorage.getItem("chatMessagesTime");
    if (saved && savedTime) {
      const now = Date.now();
      if (now - parseInt(savedTime) < EXPIRY_TIME) {
        setMessages(JSON.parse(saved));
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("chatMessagesTime");
      }
    }
  }, []);

  // Save messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      localStorage.setItem("chatMessagesTime", Date.now().toString());
    }
  }, [messages]);

  const demoMessages = [
    "How do I connect to MongoDB in Node.js?",
    "Show me a React form validation example.",
    "How can I deploy my Node.js app on Vercel?",
    "Explain JWT authentication in Express.js.",
    "Give me a Tailwind CSS responsive layout example.",
  ];

  const sendMessage = async (customMessage) => {
    const text = customMessage || input;
    if (!text.trim()) return;

    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      setIsTyping(true);
      const res = await axios.post("http://localhost:5000/chat", { message: text });
      const replyText = res.data.reply || "Sorry, I didn't understand that.";

      let i = 0;
      const typingInterval = setInterval(() => {
        if (i >= replyText.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
          return;
        }
        const currentText = replyText.slice(0, i + 1);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.sender === "bot") {
            const newPrev = [...prev];
            newPrev[newPrev.length - 1].text = currentText;
            return newPrev;
          } else {
            return [...prev, { sender: "bot", text: currentText }];
          }
        });
        i++;
      }, 15);
    } catch (err) {
      console.error("API Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Could not get response." },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-violet-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-[9999] group"
      >
        <MessageCircle size={26} className="group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] sm:w-[420px] h-[600px] shadow-2xl rounded-3xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 z-[9999] animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="relative flex justify-between items-center px-5 py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles size={20} className="text-yellow-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors duration-200"
            >
              <X size={22} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400"></div>
          </div>

          {/* Messages */}
          <div className="p-4 flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles size={32} className="text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Start a Conversation
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ask me anything! Try the suggested questions below.
                </p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
                      : "bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30"
                  }`}>
                    {msg.sender === "user" ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Sparkles size={16} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm shadow-md ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Demo Messages */}
          <div className="border-t bg-white dark:bg-gray-900 px-3 py-3 flex gap-2 overflow-x-auto border-gray-200 dark:border-gray-800 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            {demoMessages.map((demo, i) => (
              <button
                key={i}
                onClick={() => sendMessage(demo)}
                className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-violet-200 dark:border-gray-600 text-xs px-3 py-2 rounded-full shadow-sm hover:shadow-md hover:from-violet-100 hover:to-indigo-100 dark:hover:from-gray-700 dark:hover:to-gray-600 whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium"
              >
                <Sparkles size={12} className="text-violet-600 dark:text-violet-400" />
                {demo}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="p-4 border-t flex gap-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 dark:border-gray-700 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
            />
            <button
              onClick={() => sendMessage()}
              className="bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-violet-500/50 font-medium"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChat;