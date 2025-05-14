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
    { id: 1, sender: "seller", text: "Hello g! How can I help you today?" }
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

  const handleSend = async () => {
  if (input.trim() === "") return;

  const newMsg = { id: messages.length + 1, sender: "buyer", text: input.trim() };
  setMessages((prev) => [...prev, newMsg]);
  setInput("");

  try {
    const res = await fetch("http://localhost:5000/api/chatbot/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input.trim() }),
    });

    const data = await res.json();
    const botMsg = {
      id: newMsg.id + 1,
      sender: "seller",
      text: data.reply || "Sorry, I didn't understand that.",
    };
    setMessages((prev) => [...prev, botMsg]);
  } catch (error) {
    console.error("Chatbot error:", error);
    setMessages((prev) => [
      ...prev,
      {
        id: newMsg.id + 1,
        sender: "seller",
        text: "⚠️ Something went wrong. Try again later.",
      },
    ]);
  }
};


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition-colors"
        aria-label="Chat with us"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    </div>
  );
}
