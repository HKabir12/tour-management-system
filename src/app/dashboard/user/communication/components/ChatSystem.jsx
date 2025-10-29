"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import sendMessage from "../sendMessage/sendMessage";
import messageGet from "../messageGet/messageGet";

const ChatSystem = ({ result }) => {
  const { data } = useSession();
  const messageRef = useRef(null);
  // console.log(data);
  const myEmail = data?.user?.email;

  // Dummy groups
  const groups = JSON.parse(result);

  // Dummy messages
  const [messages, setMessages] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [typer, setTyper] = useState("");


  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      name: data?.user?.name,
      senderEmail: myEmail,
      tourName: selectedGroup?.tourName,
      text: newMessage,
      date: new Date().toISOString(),
    };

    socket.emit("chatMessage", { message: newMsg, room: selectedGroup?.tourName });
    const result = await sendMessage(newMsg);
    setNewMessage("");

  };


  // getUsEffect localStored
  useEffect(() => {
    const getGroup = localStorage.getItem("group");
    if (getGroup) {
      const savedGroup = JSON.parse(getGroup);
      setSelectedGroup(savedGroup);
    }
  }, [])

  // set group localStored
  useEffect(() => {
    if (selectedGroup) {
      const groupForm = JSON.stringify(selectedGroup);
      localStorage.setItem("group", groupForm);
    }
  }, [selectedGroup])


  useEffect(() => {
    socket.emit("joinRoom", { username: data?.user?.name, room: selectedGroup?.tourName });

    socket.on("roomNotice", (user) => {
      console.log("join the group", user);
    })

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => {
        const exists = prev.find(existingMsg => existingMsg.id === msg.id && existingMsg.text === msg.text && existingMsg.senderEmail === msg.senderEmail);
        if (!exists) {
          return [...prev, msg];
        }
        return prev;
      });
    })

    socket.on("typing", (data) => {
      setTyper((prev) => {
        // Check if user already exists in typing list
        if (!prev.includes(data)) {
          return [...prev, data]; // ✅ add new typer
        }
        return prev; // ✅ return same list if already present
      });
    })

    socket.on("stopTyping", (data) => {
      setTyper((prev) => prev.filter(t => t !== data));
    })

    return () => {
      socket.off("roomNotice");
      socket.off("chatMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [data, selectedGroup])


  useEffect(() => {
    if (newMessage) {
      socket.emit('typing', { username: data?.user?.name, room: selectedGroup?.tourName });

      setTimeout(() => {
        socket.emit('stopTyping', { username: data?.user?.name, room: selectedGroup?.tourName });
      }, 1000);
    }

  }, [newMessage, data])

  // fetch data
  useEffect(() => {
    if (!selectedGroup) {
      return;
    }

    setMessages([]);
    const fetchData = async () => {
      if (selectedGroup) {
        const data = { tourName: selectedGroup?.tourName };
        const result = await messageGet(data);
        const resultForm = JSON.parse(result)
        setMessages(resultForm);
      }
    }

    fetchData();

  }, [selectedGroup])

  // scroll useEffect
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  },[messages]);

  return (
    <div className="h-[90vh]  flex flex-col md:flex-row">
      {/* LEFT SIDEBAR (Groups List) */}
      <div
        className={`w-full md:w-1/3 bg-base-300 border-r border-gray-200 p-4 flex flex-col transition-all duration-300 ${selectedGroup ? "hidden md:flex" : "flex"
          }`}
      >
        <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
          Groups
        </h2>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${selectedGroup?.id === group.id
                ? "bg-blue-100"
                : "hover:bg-gray-100"
                }`}
            >
              <img
                src={group.image}
                alt={group.tourName}
                className="w-10 h-10 rounded-full"
              />
              <p className="font-medium text-blue-500">{group.tourName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE (Chat Window) */}
      <div
        className={`flex-1 flex flex-col bg-base-200 ${selectedGroup ? "flex" : "hidden md:flex"
          }`}
      >
        {/* Header */}
        {selectedGroup && (
          <div className="flex items-center justify-between bg-base-300 border-b border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={selectedGroup.image}
                alt={selectedGroup.tourName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-blue-500">{selectedGroup.tourName}</h3>
                {
                  typer.length ? <p>{typer.join(",")} typing...</p> : ""
                }

              </div>

            </div>

            {/* Back button for mobile */}
            <button
              onClick={() => setSelectedGroup(null)}
              className="md:hidden text-sm bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
            >
              Back
            </button>
          </div>
        )}

        {/* Messages Section */}
        {selectedGroup && (
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg) => {
              const isMine = msg.senderEmail === myEmail;
              return (
                <div
                  ref={messageRef}
                  key={msg.id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"
                    }`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] ${isMine
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-black rounded-bl-none"
                      }`}
                  >
                    <p className="font-semibold">{msg.name}</p>
                    <p>{msg.text}</p>
                    <p className="text-xs text-gray-700 mt-1 text-right">
                      {formatTime(msg.date)}
                    </p>
                  </div>
                </div >
              );
            })}
          </div>
        )}

        {/* Bottom Input */}
        {selectedGroup && (
          <div className="p-4 bg-base-300 border-t border-gray-200 flex items-center gap-2">
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
        )}

        {/* Empty State */}
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
