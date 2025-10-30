"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ChatSystem from "./components/ChatSystem";
import paidBooking, { Booking } from "@/components/payedBooking/paidBooking";

const ChatPage: React.FC = () => {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);

 useEffect(() => {
  const email = session?.user?.email;
  if (!email) return; // ✅ stops if null or undefined

  const fetchBookings = async () => {
    const result = await paidBooking(email); // email is now string | undefined
    setBookings(result);
  };

  fetchBookings();
}, [session]);


  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Tour Chat Groups</h1>
      <ChatSystem result={bookings} />
    </div>
  );
};

export default ChatPage;
