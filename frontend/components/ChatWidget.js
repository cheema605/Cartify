"use client";

import React, { useState, useRef, useEffect } from "react";

function Avatar({ sender }) {
  if (sender === "seller") {
    return (
      <img
        src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
        alt="AI Avatar"
        className="w-10 h-10 rounded-full select-none"
      />
    );
  }
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold select-none bg-[#157a94]">
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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "seller", text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

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
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 bg-teal-600 hover:bg-teal-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
        aria-label="Toggle chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 max-w-full h-96 bg-white rounded-lg shadow-lg flex flex-col text-black">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-teal-600 text-white rounded-t-lg">
            <h2 className="font-bold flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                  alt="AI Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>Cartify Chat</span>
            </h2>
            <button onClick={toggleOpen} aria-label="Close chat" className="text-white hover:text-gray-300">
              &times;
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-200">
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-300">
            <textarea
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={2}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSend}
              className="mt-2 w-full bg-teal-600 text-white font-semibold py-2 rounded-md hover:bg-teal-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>

  );
