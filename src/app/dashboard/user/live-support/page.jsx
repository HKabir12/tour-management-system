

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SupportPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ subject: "", message: "" });
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/support?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => setTickets(data.tickets || []))
        .catch((err) => console.error("Error loading tickets:", err));
    }
  }, [session?.user?.id]);

  // 🟡 Move conditional rendering here (AFTER hooks)
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please log in to view or submit support tickets.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        subject: form.subject,
        message: form.message,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Support ticket submitted!");
      setTickets([data.ticket, ...tickets]);
      setForm({ subject: "", message: "" });
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Support Center</h1>

      <form onSubmit={handleSubmit} className="p-4 rounded-lg shadow mb-6">
        <input
          type="text"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <textarea
          placeholder="Describe your issue"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Ticket
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">My Support Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-500">No tickets yet.</p>
        ) : (
          <ul className="space-y-3">
            {tickets.map((t, i) => (
              <li key={i} className="border p-3 rounded ">
                <p className="font-semibold">{t.subject}</p>
                <p className="text-gray-700">{t.message}</p>
                <p className="text-sm mt-1">
                  <strong>Status:</strong> {t.status}
                </p>
                {t.adminReply && (
                  <p className="mt-2 text-green-700">
                    <strong>Admin Reply:</strong> {t.adminReply}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
