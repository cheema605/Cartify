"use client";

import React, { useState, useRef, useEffect } from "react";

function Avatar({ sender }) {
  return (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold select-none ${
      sender === "buyer" ? "bg-[#157a94]" : "bg-[#0e5a6d]"
    }`}>
      {sender === "buyer" ? "B" : "S"}
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
    { id: 1, sender: "seller", text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("Hi! I am interested in your product.");
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
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#157a94] text-white font-serif">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#106b82] shadow-md">
        <h1 className="text-xl font-bold italic tracking-wide">Cartify Chat</h1>
      </header>

      {/* Centered Chat Container */}
      <main className="flex-1 flex justify-center items-center">
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
              placeholder="Type your message..."
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
              <span>Send</span>
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}
