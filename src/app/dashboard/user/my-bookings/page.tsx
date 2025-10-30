"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader } from "@/components/utilities/Loader";
import jsPDF from "jspdf";
import { CancelBookingButton } from "./components/CancelBookingButton";
import { Info } from "lucide-react";

interface Booking {
  _id: string;
  tourId: string;
  title: string;
  costFrom: number;
  maxGuest: number;
  guests: number;
  totalPrice?: number;
  userEmail: string;
  userName: string;
  status: "pending" | "approved" | "paid";
  paymentStatus: "paid" | "unpaid" | "failed";
  createdAt: string;
}

const MyBookingsPage: React.FC = () => {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch bookings
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/my-bookings?email=${session.user.email}`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data: Booking[] = await res.json();
        setBookings(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session?.user?.email]);

  // Payment handler
  const handlePayment = async (booking: Booking) => {
    if (!session?.user) return toast.error("Please login to make payment");
    if (booking.status !== "approved")
      return toast.error("Booking must be approved before payment");

    const amount = booking.totalPrice || booking.costFrom;

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: booking._id,
          tourTitle: booking.title,
          amount,
          userEmail: session.user.email,
        }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment request failed");
    }
  };

  // Download booking PDF
  const handleDownload = (booking: Booking) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("🧾 Tour Booking Details", 10, 10);
    doc.text(`Title: ${booking.title}`, 10, 20);
    doc.text(`Cost From: $${booking.costFrom}`, 10, 30);
    doc.text(`Max Guests: ${booking.maxGuest}`, 10, 40);
    doc.text(
      `Total: $${(booking.totalPrice || booking.costFrom).toFixed(2)}`,
      10,
      50
    );
    doc.text(`Payment Status: ${booking.paymentStatus}`, 10, 60);
    doc.text(`Booking Status: ${booking.status}`, 10, 70);
    doc.text(
      `Booked On: ${new Date(booking.createdAt).toLocaleDateString()}`,
      10,
      80
    );
    doc.text("Thank you for booking with us!", 10, 100);
    doc.save(`${booking.title}_booking.pdf`);
  };

  // Cancel booking handler
  const handleCancel = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/my-bookings/${bookingId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        // Show backend error
        return toast.error(data?.error || "Failed to cancel booking");
      }

      // Remove booking from UI
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.success("Booking cancelled successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel booking");
    }
  };

  const handleViewTour = (tourId: string) => {
    window.open(`/tours/${tourId}`, "_blank");
  };

  if (loading) return <Loader />;
  if (bookings.length === 0)
    return <p className="text-gray-500">No bookings found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Cost From
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Max Guests
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Payment
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                Action
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                Cancel
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b._id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              >
                <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                  {b.title}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  ${b.costFrom}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {b.maxGuest}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-lg ${
                      b.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : b.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-lg ${
                      b.paymentStatus === "paid"
                        ? "bg-green-100 text-green-600"
                        : b.paymentStatus === "failed"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {b.paymentStatus === "paid"
                      ? "Paid"
                      : b.paymentStatus === "failed"
                      ? "Failed"
                      : "Unpaid"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {b.status === "approved" && b.paymentStatus !== "paid" && (
                    <button
                      onClick={() => handlePayment(b)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Pay Now
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(b)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors mt-1"
                  >
                    Download
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <CancelBookingButton
                    bookingId={b._id}
                    disabled={b.paymentStatus === "paid"}
                    onConfirm={handleCancel}
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleViewTour(b.tourId)}
                    className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1"
                  >
                    <Info size={14} /> Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookingsPage;
