"use client";

import { Loader } from "@/components/utilities/Loader";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface Booking {
  month: string;
  count: number;
}

interface Package {
  name: string;
  count: number;
}

interface Stats {
  totalBookings: number;
  totalUsers: number;
  totalPackages: number;
  bookings: Booking[];
  packages: Package[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data: Stats = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setStats({
          totalBookings: 0,
          totalUsers: 0,
          totalPackages: 0,
          bookings: [],
          packages: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <Loader></Loader>
    );
  }

  return (
    <div className="p-6 bg-base-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold dark:text-gray-100 mb-6">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-base-300 dark:bg-gray-800 shadow rounded-lg p-5">
          <h2 className="dark:text-gray-300 font-medium">Total Bookings</h2>
          <p className="text-2xl font-bold dark:text-gray-100">
            {stats.totalBookings}
          </p>
        </div>
        <div className="bg-base-300 dark:bg-gray-800 shadow rounded-lg p-5">
          <h2 className="dark:text-gray-300 font-medium">Total Users</h2>
          <p className="text-2xl font-bold dark:text-gray-100">
            {stats.totalUsers}
          </p>
        </div>
        <div className="bg-base-300 dark:bg-gray-800 shadow rounded-lg p-5">
          <h2 className="dark:text-gray-300 font-medium">Total Packages</h2>
          <p className="text-2xl font-bold dark:text-gray-100">
            {stats.totalPackages}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Bookings Bar Chart */}
        <div className="bg-base-300 dark:bg-gray-800 shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
            Monthly Bookings
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.bookings ?? []}>
              <XAxis dataKey="month" stroke="#8884d8" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Package Popularity Pie Chart */}
        <div className="bg-base-300 dark:bg-gray-800 shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
            Package Popularity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={(stats.packages ?? []).map((p) => ({
                  name: p.name,
                  count: p.count,
                }))}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {(stats.packages ?? []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
