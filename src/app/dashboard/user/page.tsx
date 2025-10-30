"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Booking {
  id: string;
  name: string;
  date: string;
  status: "paid" | "unpaid" | "pending";
}

interface Summary {
  total: number;
  upcoming: number;
  past: number;
  paid: number;
  unpaid: number;
}

const UserDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    upcoming: 0,
    past: 0,
    paid: 0,
    unpaid: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/my-bookings?email=${session.user.email}`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data: Booking[] = await res.json();

        const now = new Date();
        const upcoming = data.filter((b) => new Date(b.date) >= now);
        const past = data.filter((b) => new Date(b.date) < now);
        const paid = data.filter((b) => b.status === "paid").length;
        const unpaid = data.filter((b) => b.status === "unpaid").length;

        setUpcomingBookings(upcoming);
        setPastBookings(past);
        setSummary({
          total: data.length,
          upcoming: upcoming.length,
          past: past.length,
          paid,
          unpaid,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session?.user?.email]);

  const BookingBadge: React.FC<{ status: string }> = ({ status }) => {
    const base = "px-2 py-1 rounded text-sm font-semibold";
    if (status === "paid")
      return (
        <span className={`${base} bg-green-200 text-green-800`}>PAID</span>
      );
    if (status === "pending")
      return (
        <span className={`${base} bg-yellow-200 text-yellow-800`}>PENDING</span>
      );
    return (
      <span className={`${base} bg-red-200 text-red-800`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading)
    return <p className="text-center mt-8">Loading your dashboard...</p>;

  return (
    <div className="p-6 space-y-8">
      {/* Welcome + Summary */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome, {session?.user?.name || "User"}!
        </h1>
        <div className="flex flex-wrap gap-4">
          {[
            {
              label: "Total Bookings",
              value: summary.total,
              color: "bg-blue-600",
            },
            {
              label: "Upcoming",
              value: summary.upcoming,
              color: "bg-green-600",
            },
            { label: "Past", value: summary.past, color: "bg-purple-600" },
            { label: "Paid", value: summary.paid, color: "bg-teal-600" },
            { label: "Unpaid", value: summary.unpaid, color: "bg-red-600" },
          ].map((item) => (
            <div
              key={item.label}
              className={`${item.color} text-white px-4 py-2 rounded shadow`}
            >
              {item.label}: {item.value}
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="flex flex-wrap gap-4">
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
      </section>

      {/* Upcoming Bookings */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Upcoming Tours
        </h2>
        {upcomingBookings.length ? (
          <ul className="space-y-3">
            {upcomingBookings.map((b) => (
              <li
                key={b.id}
                className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {b.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    {new Date(b.date).toLocaleDateString()}
                  </p>
                </div>
                <BookingBadge status={b.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No upcoming tours.</p>
        )}
      </section>

      {/* Past Bookings */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Past Tours
        </h2>
        {pastBookings.length ? (
          <ul className="space-y-3">
            {pastBookings.map((b) => (
              <li
                key={b.id}
                className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {b.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    {new Date(b.date).toLocaleDateString()}
                  </p>
                </div>
                <BookingBadge status={b.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No past tours.</p>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
