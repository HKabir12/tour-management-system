"use client";

import React from "react";
import { Star } from "lucide-react";

export default function RoomCard({ room, onDetails }) {
  return (
    <div className="border rounded-2xl p-4 shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-transform hover:scale-[1.02]">
      <img
        src={room.image}
        alt={room.name}
        className="w-full h-48 object-cover rounded-xl mb-3"
      />

      <h2 className="text-xl font-semibold">{room.name}</h2>
      <p className="text-gray-600 dark:text-gray-300">Type: {room.type}</p>
      <p className="font-bold text-emerald-600 mb-2">Price: ${room.price}</p>

      {/* ⭐ Review */}
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={`${
              i < room.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-500">({room.rating}.0)</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onDetails(room)}
          className="flex-1 py-2 rounded-xl border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
        >
          Details
        </button>
      </div>
    </div>
  );
}
