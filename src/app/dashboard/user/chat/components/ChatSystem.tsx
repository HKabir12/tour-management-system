"use client";

import React, { useEffect, useState } from "react";
import messageGet from "./messageGet/messageGet";

import Image from "next/image";
import sendMessage from "./messageSend/sendMessage";

interface Group {
  id: string;
  tourName: string;
  image: string;
}

interface Message {
  id: string | number;
  name: string;
  senderEmail: string;
  tourName: string;
  text: string;
  date: string;
}

interface ChatSystemProps {
  result: Group[];
}

const ChatSystem: React.FC<ChatSystemProps> = ({ result }) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  // ✅ Fetch messages when group changes
  useEffect(() => {
    if (!selectedGroup) return;

    const fetchMessages = async () => {
      const msgs = await messageGet({ tourName: selectedGroup.tourName });
      setMessages(
        msgs.map((msg: Message, index: number) => ({
          ...msg,
          id: msg.id || index,
        }))
      );
    };

    fetchMessages();
  }, [selectedGroup]);

  // ✅ Handle send message
  const handleSend = async () => {
    if (!selectedGroup || !text.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      name: "You",
      senderEmail: "you@example.com", // 🔁 replace with session?.user?.email if available
      tourName: selectedGroup.tourName,
      text,
      date: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setText("");

    await sendMessage(newMsg);
  };

  return (
    <div className="flex h-[80vh] border overflow-hidden  ">
      {/* Sidebar - Group List */}
      <div className="w-1/3 border-r  p-3 overflow-y-auto">
        <h2 className="text-lg font-bold mb-3">Tour Groups</h2>
        {result.length === 0 ? (
          <p className="text-gray-500">No paid tours found</p>
        ) : (
          <ul>
            {result.map((group) => (
              <li
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`cursor-pointer flex items-center gap-2 p-2 mb-2 rounded-lg ${
                  selectedGroup?.id === group.id
                    ? "bg-blue-500 "
                    : ""
                }`}
              >
                <Image
                  src={group.image}
                  alt={group.tourName}
                  width={40}
                  height={20}
                  className="w-10 h-10 rounded-md  object-cover"
                />
                <span>{group.tourName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <>
            <div className="border-b p-3 font-semibold ">
              {selectedGroup.tourName}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 ? (
                <p className="text-center mt-5">
                  No messages yet. Start the chat!
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-lg ${
                      msg.name === "You"
                        ? " ml-auto max-w-[70%]"
                        : " mr-auto max-w-[70%]"
                    }`}
                  >
                    <div className="text-sm text-gray-600">{msg.name}</div>
                    <div>{msg.text}</div>
                    <div className="text-xs  text-right">
                      {new Date(msg.date).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500  px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center ">
            Select a tour to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
