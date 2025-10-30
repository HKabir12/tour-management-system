"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Check,
  X,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Plane,
  DollarSign,
  Trash2,
  Info,
} from "lucide-react";

interface Booking {
  _id: string;
  tourId: string;
  title: string;
  costFrom: number;
  userName: string;
  totalPrice: number;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

interface Alert {
  message: string;
  type: "success" | "error" | null;
}

const InlineAlert: React.FC<{
  message?: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  if (!message) return null;
  let bg = "bg-gray-500",
    Icon = Clock;
  if (type === "success") {
    bg = "bg-green-600";
    Icon = CheckCircle;
  }
  if (type === "error") {
    bg = "bg-red-600";
    Icon = XCircle;
  }

  return (
    <div
      className={`${bg} fixed top-4 right-4 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50`}
    >
      <Icon size={18} /> <span>{message}</span>
      <button onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let color = "bg-yellow-100 text-yellow-700",
    Icon = Clock;
  if (status === "approved") {
    color = "bg-green-100 text-green-700";
    Icon = Check;
  }
  if (status === "rejected") {
    color = "bg-red-100 text-red-700";
    Icon = X;
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${color}`}
    >
      <Icon size={14} /> {status.toUpperCase()}
    </span>
  );
};

export default function AllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const tableWrapperRef = useRef<HTMLDivElement | null>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  // ✅ Fetch Bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAlert({ message: "Could not fetch bookings.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update booking status
  const handleStatusChange = async (
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status } : b))
        );
        setAlert({ message: `Booking ${status}`, type: "success" });
      } else throw new Error(data.error);
    } catch (err) {
      console.log(err)
      setAlert({ message: "Update failed", type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ Delete rejected booking
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rejected booking?"))
      return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        setAlert({ message: "Booking deleted successfully", type: "success" });
      } else {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
    } catch (err) {
      console.log(err)
      setAlert({ message: "Delete failed", type: "error" });
    }
  };

  // ✅ Tour details redirect
  const handleViewTour = (tourId: string) => {
    window.open(`/tours/${tourId}`, "_blank");
  };

  // ✅ Scroll indicator
  const handleScroll = () => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;
    const { scrollLeft, scrollWidth, clientWidth } = wrapper;
    setScrollPercent((scrollLeft / (scrollWidth - clientWidth)) * 100);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 p-4 md:p-6">
      <InlineAlert
        message={alert?.message}
        type={alert?.type || undefined}
        onClose={() => setAlert(null)}
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 dark:text-gray-100">
          Booking Approval Center
        </h1>

        <div className="bg-base-300 dark:bg-gray-800 shadow-2xl rounded-xl relative">
          {loading ? (
            <div className="p-6 flex items-center justify-center gap-3">
              <Loader2 className="animate-spin text-blue-600" /> Loading
              bookings...
            </div>
          ) : bookings.length === 0 ? (
            <p className="p-10 text-center text-gray-500">No bookings found.</p>
          ) : (
            <>
              <div
                ref={tableWrapperRef}
                className="overflow-x-auto scrollbar-hide relative"
                onScroll={handleScroll}
                style={{ scrollBehavior: "smooth" }}
              >
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-base-100 dark:bg-gray-700 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                        <Plane size={16} className="inline mr-1" /> Tour Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                        <Users size={16} className="inline mr-1" /> User
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                        <DollarSign size={16} className="inline mr-1" /> Cost
                        From
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                        Total Price
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                        <Calendar size={16} className="inline mr-1" /> Date
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {bookings.map((b) => (
                      <tr
                        key={b._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          {b.title}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {b.userName}
                        </td>
                        <td className="px-4 py-3 text-center">${b.costFrom}</td>
                        <td className="px-4 py-3 text-center">
                          ${b.costFrom}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          {b.status === "pending" ? (
                            <div className="flex justify-center gap-2 flex-wrap">
                              <button
                                onClick={() =>
                                  handleStatusChange(b._id, "approved")
                                }
                                disabled={updatingId === b._id}
                                className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs md:text-sm"
                              >
                                {updatingId === b._id ? (
                                  <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                  "Approve"
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(b._id, "rejected")
                                }
                                disabled={updatingId === b._id}
                                className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs md:text-sm"
                              >
                                {updatingId === b._id ? (
                                  <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                  "Reject"
                                )}
                              </button>
                            </div>
                          ) : b.status === "rejected" ? (
                            <div className="flex justify-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleDelete(b._id)}
                                className="bg-red-700 text-white px-2 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleViewTour(b.tourId)}
                              className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1"
                            >
                              <Info size={14} /> Details
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-b-xl mt-1 relative">
                <div
                  className="h-1 bg-blue-600 dark:bg-blue-400 rounded-b-xl transition-all"
                  style={{ width: `${scrollPercent}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
