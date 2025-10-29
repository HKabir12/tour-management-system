"use client";

import React, { useState, useEffect } from "react";
import RoomCard from "./RoomCard";
import LoadingSpinner from "@/app/register/components/LoadingSpinner";
import Swal from "sweetalert2";

export default function RoomBookPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch rooms from backend API
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/rooms");
        console.log(res.data);
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load rooms!",
          confirmButtonColor: "#2563EB",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Handle booking a room
  const handleBook = async (roomId) => {
    try {
      const res = await fetch(`/api/rooms/book/${roomId}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Booking failed");

      const updatedRoom = await res.json();

      // Update local state
      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, available: false } : room
        )
      );

      setSelectedRoom(null);

      Swal.fire({
        icon: "success",
        title: "Booked successfully!",
        timer: 1200,
        showConfirmButton: false,
        position: "top-end",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Booking failed",
        text: "Please try again later",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="container mx-auto max-w-7xl py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-2">
          🏨 Explore Our Top Rooms
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover comfortable stays with real-time availability. Choose your
          perfect getaway!
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} onDetails={setSelectedRoom} />
        ))}
      </div>

      {/* Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full shadow-lg relative">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <img
              src={selectedRoom.image}
              alt={selectedRoom.name}
              className="w-full h-56 object-cover rounded-xl mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">{selectedRoom.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Type: {selectedRoom.type}
            </p>
            <p className="font-semibold text-emerald-600 mb-3">
              Price: ${selectedRoom.price}
            </p>
            <p className="text-gray-700 dark:text-gray-400 mb-6">
              {selectedRoom.description}
            </p>

            <button
              onClick={() => handleBook(selectedRoom._id)}
              disabled={!selectedRoom.available}
              className={`w-full py-3 rounded-xl text-white font-semibold ${
                selectedRoom.available
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {selectedRoom.available ? "Book Now" : "Already Booked"}
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button className="px-6 py-2 bg-emerald-500 text-white text-lg font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-200">
          See More
        </button>
      </div>
    </section>
  );
}
