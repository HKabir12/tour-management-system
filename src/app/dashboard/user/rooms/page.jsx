"use client";

import React, { useState } from "react";

export default function RoomsPage() {
  // 🧠 Step 1: Mock Data
  const [rooms, setRooms] = useState([
    { id: 1, name: "Hotel Sea View", type: "Deluxe", price: 120, available: true },
    { id: 2, name: "Hilltop Resort", type: "Standard", price: 80, available: true },
    { id: 3, name: "Sundarban Eco Stay", type: "Cottage", price: 100, available: false },
  ]);

  // 🛎️ Step 2: Book Now Button Handler
  const handleBook = (id) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === id ? { ...room, available: false } : room
      )
    );
    alert(`✅ Room ${id} booked successfully!`);
  };

  // 🏠 Step 3: UI Rendering
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🏨 Available Rooms (Mock Test)
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-2xl p-6 shadow-md bg-white dark:bg-gray-800 transition-transform hover:scale-[1.02]"
          >
            <h2 className="text-xl font-semibold mb-1">{room.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              Type: {room.type}
            </p>
            <p className="font-bold text-emerald-600 mb-3">
              Price: ${room.price}
            </p>

            {room.available ? (
              <button
                onClick={() => handleBook(room.id)}
                className="w-full bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600"
              >
                Book Now
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-2 rounded-xl cursor-not-allowed"
              >
                Unavailable
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
