"use client"; // Error boundary always client হতে হবে

import React from "react";
import { TriangleAlert, Home } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/4F46E5/ffffff?text=Travel+Background')",
          filter: "blur(4px)",
          transform: "scale(1.05)",
        }}
      />
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Error Content Card */}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 text-center max-w-lg w-full transform transition-all duration-300 scale-100 hover:scale-105">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <TriangleAlert size={80} className="text-red-500" />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-800 dark:text-gray-200">
          Oops! Something went wrong
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {error?.message ||
            "We're sorry, but an unexpected error occurred. Please try again later."}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Home size={20} className="mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
