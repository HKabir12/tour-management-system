"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function BookingModal({ tour, onClose }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    guests: 1,
    startDate: "",
    endDate: "",
    from: "",
    to: tour?.title || "",
  });
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookingExists, setBookingExists] = useState(false);

  useEffect(() => {
    const checkBooking = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(
          `/api/bookings?userId=${session.user.id}&tourId=${tour._id}`
        );
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setBookingExists(true);
          setBookingStatus(data[0].status);
          setFormData({
            guests: data[0].guests,
            startDate: data[0].startDate || "",
            endDate: data[0].endDate || "",
            from: data[0].from || "",
            to: data[0].to || tour.title,
          });
        }
      } catch (err) {
        console.error("Check booking error:", err);
      }
    };
    checkBooking();
  }, [session, tour._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    if (!session?.user?.id) {
      return MySwal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login to book this tour",
      });
    }

    if (!formData.guests || formData.guests < 1) {
      return MySwal.fire({
        icon: "warning",
        title: "Invalid Guests",
        text: "Please enter a valid number of guests",
      });
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour._id,
          userId: session.user.id,
          name: session.user.name,
          email: session.user.email,
          guests: formData.guests,
          tourName: tour.title,
          price: tour.price,
          totalPrice: tour.price * formData.guests,
          startDate: formData.startDate,
          endDate: formData.endDate,
          from: formData.from,
          to: formData.to,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setBookingExists(true);
        setBookingStatus("pending");

        await MySwal.fire({
          icon: "success",
          title: "Booking Pending",
          text: `Your booking for "${tour.title}" is pending approval.`,
        });

        onClose();
      } else {
        MySwal.fire({
          icon: "error",
          title: "Booking Failed",
          text: data.error || "Something went wrong",
        });
      }
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    MySwal.fire({
      icon: "info",
      title: "Payment",
      text: "Redirect to payment gateway (implement your payment logic here).",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-bold text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {tour?.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
          {tour?.description}
        </p>
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
          Price per guest: ${tour?.price}
        </p>

        {!bookingExists ? (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={session?.user?.name || ""}
              disabled
              className="border px-4 py-2 rounded-lg w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
            <input
              type="email"
              value={session?.user?.email || ""}
              disabled
              className="border px-4 py-2 rounded-lg w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
            <input
              type="number"
              name="guests"
              value={formData.guests}
              min={1}
              onChange={handleChange}
              className="border px-4 py-2 rounded-lg w-full"
            />
            <h3 className="font-semibold text-lg">Tour Details</h3>
            <div className="flex gap-2">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-1/2 border p-2 rounded"
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-1/2 border p-2 rounded"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                name="from"
                placeholder="From"
                value={formData.from}
                onChange={handleChange}
                className="w-1/2 border p-2 rounded"
              />
              <input
                type="text"
                name="to"
                placeholder="To"
                value={formData.to}
                onChange={handleChange}
                className="w-1/2 border p-2 rounded"
              />
            </div>
            <p className="font-semibold">
              Total Price: ${tour?.price * formData.guests}
            </p>
            <button
              onClick={handleBooking}
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {loading ? "Booking..." : "Book Now"}
            </button>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <p className="text-gray-700 dark:text-gray-200 font-semibold mb-2">
              Booking Status:{" "}
              <span
                className={`${
                  bookingStatus === "pending"
                    ? "text-yellow-500"
                    : bookingStatus === "approved"
                    ? "text-blue-500"
                    : "text-green-600"
                }`}
              >
                {bookingStatus}
              </span>
            </p>
            {bookingStatus === "approved" && (
              <button
                onClick={onPayment}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md"
              >
                Pay Now!
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
