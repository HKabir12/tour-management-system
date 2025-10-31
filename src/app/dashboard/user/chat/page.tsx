"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ChatSystem from "./components/ChatSystem";
import paidBooking, { Booking } from "@/components/payedBooking/paidBooking";

const ChatPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchBookings = async () => {
      const email = session?.user?.email ?? ""; // ✅ handle null safely
      if (!email) return;

      const result = await paidBooking(email);
      setBookings(result);
      setLoading(false);
    };

    fetchBookings();
  }, [session, status]);

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500">
        Loading chat groups...
      </div>
    );

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Tour Chat Groups</h1>
      {bookings.length ? (
        <ChatSystem result={bookings} />
      ) : (
        <p className="text-gray-500">No paid tours found 💡</p>
      )}
    </div>
  );
};

export default ChatPage;
