"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { MessageCircle, X, Send, User, Cpu } from "lucide-react";

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
      const replyText = res.data.reply || "Sorry, I didn’t understand that.";

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
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center z-[9999] dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-[90vw] sm:w-96 h-[70vh] shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-[9999]">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-blue-600 dark:bg-blue-700 text-white">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Chat
            </h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="p-3 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm flex items-center gap-1 ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none dark:bg-blue-400"
                      : "bg-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-100"
                  }`}
                >
                  {msg.sender === "user" ? <User size={16} /> : <Cpu size={16} />}
                  {msg.text}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="text-left italic text-sm mt-1 flex items-center gap-1 text-gray-500 dark:text-gray-300">
                AI is typing...
              </div>
            )}
          </div>

          {/* Demo Messages */}
          <div className="border-t bg-gray-100 px-3 py-2 flex gap-2 overflow-x-auto dark:bg-gray-800">
            {demoMessages.map((demo, i) => (
              <button
                key={i}
                onClick={() => sendMessage(demo)}
                className="bg-white border text-xs px-3 py-1 rounded-full shadow-sm hover:bg-blue-50 whitespace-nowrap flex items-center gap-1 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-blue-900"
              >
                <Cpu size={14} /> {demo}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="p-3 border-t flex gap-2 border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 border p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <button
              onClick={() => sendMessage()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Send size={16} /> Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChat;
