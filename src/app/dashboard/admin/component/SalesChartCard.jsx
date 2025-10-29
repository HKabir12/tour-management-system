"use client";

import React from "react";
import { TrendingUp, Package, Clock } from "lucide-react";

// --- Props: data = monthly sales, recentPackages, recentBookings ---
const SalesChartCard = ({ data, recentPackages, recentBookings }) => {
  const maxSales = Math.max(...data.map(d => d.sales)) * 1.1;
  const formatSales = (sales) => `$${(sales / 1000).toFixed(0)}k`;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full space-y-8">

      {/* --- Chart Section --- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Annual Revenue Overview</h3>
          <TrendingUp className="text-pink-600 dark:text-pink-400" size={24} />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Monthly sales performance for the current year. Max: {formatSales(maxSales / 1.1)}
        </div>
        <div className="relative" style={{ height: 300 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            {[1,2,3].map(i => (
              <line key={i} x1="0" y1={100-(i*25)} x2="100" y2={100-(i*25)} stroke="#e5e7eb" strokeWidth="0.5"/>
            ))}
            {data.map((item, index) => {
              const barWidth = 6;
              const barSpacing = (100 - data.length*barWidth)/(data.length-1);
              const x = index*(barWidth + barSpacing);
              const height = (item.sales / maxSales)*100;
              const y = 100 - height;
              const barColor = item.sales === Math.max(...data.map(d => d.sales)) ? "#EF4444" : "#3B82F6";

              return (
                <React.Fragment key={item.month}>
                  <rect x={x} y={y} width={barWidth} height={height} rx="1.5" fill={barColor} className="transition-all duration-500 ease-out transform hover:scale-y-105 origin-bottom" />
                  <text x={x+barWidth/2} y="105" fontSize="3" fill="#6b7280" textAnchor="middle">{item.month}</text>
                  <text x={x+barWidth/2} y={y-2} fontSize="3" fontWeight="bold" fill={barColor} textAnchor="middle">{formatSales(item.sales)}</text>
                </React.Fragment>
              );
            })}
          </svg>
        </div>
      </div>

      {/* --- Recent Packages & Bookings --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Packages */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-600">
          <h4 className="flex items-center font-bold text-gray-800 dark:text-gray-100 mb-3">
            <Package className="mr-2" /> Recent Packages
          </h4>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            {recentPackages && recentPackages.length > 0 ? recentPackages.map((pkg, idx) => (
              <li key={idx} className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-1">
                <span>{pkg.title}</span>
                <span className="font-semibold">{pkg.price}</span>
              </li>
            )) : <li>No recent packages</li>}
          </ul>
        </div>

        {/* Recent Bookings */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-600">
          <h4 className="flex items-center font-bold text-gray-800 dark:text-gray-100 mb-3">
            <Clock className="mr-2" /> Recent Bookings
          </h4>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            {recentBookings && recentBookings.length > 0 ? recentBookings.map((booking, idx) => (
              <li key={idx} className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-1">
                <span>{booking.user}</span>
                <span className="font-semibold">{booking.packageTitle}</span>
              </li>
            )) : <li>No recent bookings</li>}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default SalesChartCard;
