"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader } from "@/components/utilities/Loader";


const UserDashboard = () => {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dashboard summary
  const [summary, setSummary] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    paid: 0,
    unpaid: 0,
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings?userId=${session.user.id}`);
        const data = await res.json();

        setBookings(data || []);

        // Compute summary
        const now = new Date();
        const upcoming = data.filter((b) => new Date(b.date) >= now).length;
        const past = data.filter((b) => new Date(b.date) < now).length;
        const paid = data.filter((b) => b.status === "paid").length;
        const unpaid = data.filter((b) => b.status === "unpaid").length;

        setSummary({
          total: data.length,
          upcoming,
          past,
          paid,
          unpaid,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session?.user?.id]);

  if (loading) return <Loader />;

  // Separate upcoming & past bookings
  const now = new Date();
  const upcomingBookings = bookings.filter((b) => new Date(b.date) >= now);
  const pastBookings = bookings.filter((b) => new Date(b.date) < now);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome + Summary */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome, {session?.user?.name || "User"}!
        </h1>

        <div className="flex flex-wrap gap-4">
          <div className="bg-blue-600 text-white px-4 py-2 rounded shadow">
            Total Bookings: {summary.total}
          </div>
          <div className="bg-green-600 text-white px-4 py-2 rounded shadow">
            Upcoming: {summary.upcoming}
          </div>
          <div className="bg-purple-600 text-white px-4 py-2 rounded shadow">
            Past: {summary.past}
          </div>
          <div className="bg-teal-600 text-white px-4 py-2 rounded shadow">
            Paid: {summary.paid}
          </div>
          <div className="bg-red-600 text-white px-4 py-2 rounded shadow">
            Unpaid: {summary.unpaid}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/tours"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Book a Tour
        </Link>
        <Link
          href="/destinations"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          View Destinations
        </Link>
        <Link
          href="/my-bookings"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          My Bookings
        </Link>
      </div>

      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Upcoming Tours
        </h2>
        {upcomingBookings.length > 0 ? (
          <ul className="space-y-2">
            {upcomingBookings.map((b) => (
              <li
                key={b.id}
                className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition flex justify-between items-center"
              >
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {b.name}
                  </span>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">
                    {new Date(b.date).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    b.status === "paid" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {b.status.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No upcoming tours.</p>
        )}
      </div>

      {/* Past Bookings */}
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Past Tours
        </h2>
        {pastBookings.length > 0 ? (
          <ul className="space-y-2">
            {pastBookings.map((b) => (
              <li
                key={b.id}
                className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition flex justify-between items-center"
              >
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {b.name}
                  </span>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">
                    {new Date(b.date).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    b.status === "paid" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {b.status.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No past tours.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
