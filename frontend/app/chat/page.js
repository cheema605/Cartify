"use client";

import React, { useState, useRef, useEffect } from "react";

function Avatar({ sender }) {
  if (sender === "seller") {
    return (
      <img
        src="/images/ai-avatar.gif"
        alt="AI Avatar"
        className="w-12 h-12 rounded-full select-none"
      />
    );
  }
  return (
    <div className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold select-none bg-[#157a94]">
      B
    </div>
  );
}

function Message({ msg }) {
  return (
    <div
      className={`max-w-xs px-4 py-2 rounded-lg shadow-md flex space-x-3 items-end ${
        msg.sender === "buyer"
          ? "bg-white text-[#157a94] self-end flex-row-reverse"
          : "bg-[#0e5a6d] text-white self-start"
      }`}
    >
      <Avatar sender={msg.sender} />
      <div className="break-words">{msg.text}</div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "seller", text: "Hello! How can I help yous today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "buyer", text: input.trim() },
    ]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-black font-serif pt-20">
      {/* Centered Chat Container */}
      <main className="flex-1 flex justify-center items-center px-4">
        <div className="flex flex-col w-full max-w-md h-[600px] bg-white rounded-lg shadow-lg text-black">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-[#0e5a6d] scrollbar-track-[#f0f0f0]">
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <footer className="flex items-center px-6 py-4 border-t border-gray-300">
            <textarea
              className="flex-1 resize-none rounded-lg px-4 py-2 mr-4 text-black focus:outline-none focus:ring-2 focus:ring-[#0e5a6d]"
              rows={1}
              placeholder="Type your messages..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSend}
              className="bg-[#157a94] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#0e5a6d] transition flex items-center space-x-2"
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>Send it!</span>
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}
