// src/app/dashboard/chat/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";

type ChatSender = "USER" | "SYSTEM" | "ADMIN";

interface ChatMessage {
  id: string;
  userId: string;
  sender: ChatSender;
  text: string;
  jobAdId?: string | null;
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat", { cache: "no-store" });
      if (!res.ok) return;
      const data: ChatMessage[] = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ text: newMessage }),
      });

      if (!res.ok) {
        console.error("Failed to send message");
        return;
      }

      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-120px)] max-w-xl mx-auto bg-white 
      rounded-xl border p-4 shadow-sm"
      dir="rtl"
    >
      <h2 className="text-xl font-bold mb-4 text-right">پیام‌های شما</h2>

      {/* لیست پیام‌ها */}
      <div className="flex-1 overflow-y-auto space-y-3 px-2">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-10">هیچ پیامی ندارید.</p>
        )}

        {messages.map((msg) => {
          const isUser = msg.sender === "USER";
          const isAdmin = msg.sender === "ADMIN";

          const bubbleClasses = isUser
            ? "bg-blue-500 text-white self-start"
            : isAdmin
            ? "bg-purple-500 text-white self-end"
            : "bg-gray-200 text-black self-end";

          const alignStyle = isUser
            ? { marginRight: "auto" as const }
            : { marginLeft: "auto" as const };

          return (
            <div
              key={msg.id}
              className={`max-w-[80%] p-3 rounded-xl text-sm ${bubbleClasses}`}
              style={alignStyle}
            >
              <div>{msg.text}</div>
              <div className="text-[10px] opacity-60 mt-1">
                {new Date(msg.createdAt).toLocaleString("fa-IR")}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* نوار ارسال پیام */}
      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-right"
          placeholder="پیامت را بنویس..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ارسال
        </button>
      </div>
    </div>
  );
}
