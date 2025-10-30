"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { socket } from "./socket";
import sendMessage from "./messageSend/sendMessage";
import messageGet from "./messageGet/messageGet";

// Booking type from your paidBooking
export interface Booking {
  id: string;
  tourName: string;
  image: string;
}

// Props
interface ChatSystemProps {
  result: Booking[];
}

// Group displayed in sidebar
interface Group {
  id: string;
  title: string;
  image: string;
}

// Single chat message
interface Message {
  id:string | number;
  name: string;
  senderEmail: string;
  tourName: string;
  text: string;
  date: string;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ result }) => {
  const { data: session } = useSession();
  const myEmail = session?.user?.email;

  // Convert Bookings to Groups
  const groups: Group[] = result.map((b) => ({
    id: b.id,
    title: b.tourName,
    image: b.image,
  }));

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typer, setTyper] = useState<string[]>([]);
  const messageRef = useRef<HTMLDivElement>(null);

  // Scroll to last message
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load last selected group from localStorage
  useEffect(() => {
    const savedGroup = localStorage.getItem("group");
    if (savedGroup) setSelectedGroup(JSON.parse(savedGroup));
  }, []);

  // Save group selection to localStorage
  useEffect(() => {
    if (selectedGroup) {
      localStorage.setItem("group", JSON.stringify(selectedGroup));
    }
  }, [selectedGroup]);

  // Fetch messages for selected group
  useEffect(() => {
    if (!selectedGroup) return;

    const fetchMessages = async () => {
      const msgs = await messageGet({ tourName: selectedGroup.title });
      setMessages(msgs);
    };

    fetchMessages();
  }, [selectedGroup]);

  // Socket.io connection
  useEffect(() => {
    if (!selectedGroup || !session?.user?.name) return;

    socket.emit("joinRoom", { username: session.user.name, room: selectedGroup.title });

    socket.on("chatMessage", (msg: Message) => {
      setMessages((prev) => {
        const exists = prev.find(
          (m) => m.id === msg.id && m.text === msg.text && m.senderEmail === msg.senderEmail
        );
        if (!exists) return [...prev, msg];
        return prev;
      });
    });

    socket.on("typing", (username: string) => {
      setTyper((prev) => (prev.includes(username) ? prev : [...prev, username]));
    });

    socket.on("stopTyping", (username: string) => {
      setTyper((prev) => prev.filter((t) => t !== username));
    });

    return () => {
      socket.off("chatMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [selectedGroup, session]);

  // Emit typing events
  useEffect(() => {
    if (!newMessage || !selectedGroup || !session?.user?.name) return;

    socket.emit("typing", { username: session.user.name, room: selectedGroup.title });
    const timeout = setTimeout(() => {
      socket.emit("stopTyping", { username: session.user.name, room: selectedGroup.title });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [newMessage, selectedGroup, session]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const msg: Message = {
      id: Date.now(),
      name: session?.user?.name || "",
      senderEmail: myEmail || "",
      tourName: selectedGroup.title,
      text: newMessage,
      date: new Date().toISOString(),
    };

    socket.emit("chatMessage", { message: msg, room: selectedGroup.title });
    await sendMessage(msg);
    setNewMessage("");
  };

  const formatTime = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-[90vh] flex flex-col md:flex-row">
      {/* Groups Sidebar */}
      <div
        className={`w-full md:w-1/3 bg-base-300 border-r p-4 flex flex-col overflow-y-auto ${
          selectedGroup ? "hidden md:flex" : "flex"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4 text-center md:text-left">Groups</h2>
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => setSelectedGroup(group)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
              selectedGroup?.id === group.id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
            <p className="font-medium text-blue-500">{group.title}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-base-200 ${selectedGroup ? "flex" : "hidden md:flex"}`}>
        {selectedGroup && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between bg-base-300 border-b p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-blue-500">{selectedGroup.title}</h3>
                  {typer.length ? <p>{typer.join(", ")} typing...</p> : null}
                </div>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="md:hidden text-sm bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg) => {
                const isMine = msg.senderEmail === myEmail;
                return (
                  <div
                    ref={messageRef}
                    key={msg.id}
                    className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[80%] ${
                        isMine ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none"
                      }`}
                    >
                      <p className="font-semibold">{msg.name}</p>
                      <p>{msg.text}</p>
                      <p className="text-xs text-gray-700 mt-1 text-right">{formatTime(msg.date)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 bg-base-300 border-t flex items-center gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 resize-none border border-gray-300 rounded-lg p-2 h-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Send
              </button>
            </div>
          </>
        )}

        {/* Empty state */}
        {!selectedGroup && (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 text-lg">
            Select a group to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
