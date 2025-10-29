"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    activeDiscounts: 0,
    bookingsByMonth: [],
    topTours: [],
  });
// console.log(topTours.length)
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      setStats(data);
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">📊 Tour Management Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: "Total Tours", value: stats.totalTours },
          { label: "Total Bookings", value: stats.totalBookings },
          { label: "Revenue ($)", value: stats.totalRevenue },
          { label: "Users", value: stats.totalUsers },
          { label: "Active Discounts", value: stats.activeDiscounts },
        ].map((item, i) => (
          <div key={i} className=" rounded-xl shadow p-5 text-center">
            <p className="text-sm ">{item.label}</p>
            <h3 className="text-2xl font-semibold text-blue-600 mt-2">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Bookings by Month Chart */}
      <div className=" max-w-6xl mx-auto rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 ">📅 Bookings per Month</h2>
        <Bar
          data={{
            labels: stats.bookingsByMonth.map(b => b.month),
            datasets: [
              {
                label: "Bookings",
                data: stats.bookingsByMonth.map(b => b.count),
                backgroundColor: "#3b82f6",
              },
            ],
          }}
        />
      </div>

      {/* Top Tours */}
      <div className=" rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 ">🏆 Top Tours by Revenue</h2>
        <ul className="divide-y divide-gray-200">
          {stats.topTours.map((tour, i) => (
            <li key={i} className="flex justify-between py-3 ">
              <span>{tour.title}</span>
              <span className="font-medium">${tour.revenue}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}



