"use client";
import React, { useState } from "react";

export default function TravelBuddyPage() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    budget: "",
    notes: "",
  });

  const [search, setSearch] = useState({ from: "", to: "" });
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Create Travel Buddy Post
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("Creating your travel buddy post...");

    try {
      const res = await fetch("/api/travel-buddy/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Post created successfully!");
        setFormData({ from: "", to: "", date: "", budget: "", notes: "" });
      } else {
        setMessage("❌ Failed to create post.");
      }
    } catch (error) {
      setMessage("❌ Error connecting to server.");
    }
  };

  // 🔍 Find Matching Buddies
  const handleFind = async (e) => {
    e.preventDefault();
    setMessage("Searching for matching travel buddies...");

    try {
      const res = await fetch(
        `/api/travel-buddy/find?from=${search.from}&to=${search.to}`
      );
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
        setMessage(`✅ Found ${data.matches.length} matches.`);
      } else {
        setMessage("❌ No matches found.");
      }
    } catch (error) {
      setMessage("❌ Error fetching data.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-6">
        🧭 Travel Buddy Dashboard
      </h1>

      {/* ✅ CREATE POST SECTION */}
      <section className="bg-white shadow-lg p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">
          ✈️ Create a Travel Buddy Post
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="From (e.g., Dhaka)"
              value={formData.from}
              onChange={(e) =>
                setFormData({ ...formData, from: e.target.value })
              }
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="To (e.g., Cox’s Bazar)"
              value={formData.to}
              onChange={(e) =>
                setFormData({ ...formData, to: e.target.value })
              }
              className="border p-2 rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Budget (e.g., 10000)"
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
              className="border p-2 rounded-lg"
              required
            />
          </div>
          <textarea
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="border p-2 rounded-lg w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Post
          </button>
        </form>
      </section>

      {/* 🔍 FIND BUDDY SECTION */}
      <section className="bg-white shadow-lg p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">🔍 Find a Travel Buddy</h2>
        <form onSubmit={handleFind} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="From"
              value={search.from}
              onChange={(e) => setSearch({ ...search, from: e.target.value })}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="To"
              value={search.to}
              onChange={(e) => setSearch({ ...search, to: e.target.value })}
              className="border p-2 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Find Buddy
          </button>
        </form>

        {/* ✅ Display Matches */}
        <div className="mt-6">
          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((buddy, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <p>
                    <strong>From:</strong> {buddy.from} →{" "}
                    <strong>To:</strong> {buddy.to}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(buddy.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Budget:</strong> {buddy.budget} ৳
                  </p>
                  {buddy.notes && <p>📝 {buddy.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No matches found yet.</p>
          )}
        </div>
      </section>

      {/* Status Message */}
      {message && (
        <p className="text-center text-blue-600 font-medium">{message}</p>
      )}
    </div>
  );
}
