"use client";
import { Loader } from "@/components/utilities/Loader";
import { useEffect, useState } from "react";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Fetch all tickets
  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/support");
      const data = await res.json();
      console.log("Fetched tickets data:", data);

      // ✅ FIX: extract the tickets array
      if (Array.isArray(data)) {
        setTickets(data);
      } else if (Array.isArray(data.tickets)) {
        setTickets(data.tickets);
      } else {
        console.warn("Unexpected response format:", data);
        setTickets([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Handle reply submit
  const handleReply = async (id) => {
    if (!replyText.trim()) return alert("Reply cannot be empty!");
    try {
      const res = await fetch("/api/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reply: replyText }),
      });
      if (res.ok) {
        alert("Reply sent!");
        setReplyText("");
        setReplyingTo(null);
        fetchTickets();
      }
    } catch (error) {
      console.error("Error replying:", error);
    }
  };

  // Handle close ticket
  const handleClose = async (id) => {
    try {
      const res = await fetch("/api/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Resolved" }),
      });
      if (res.ok) {
        alert("Ticket marked as resolved!");
        fetchTickets();
      }
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };

  if (loading) return <Loader></Loader>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Support Management</h1>
      {tickets.length === 0 ? (
        <p>No support tickets found.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="border dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">{ticket.subject}</h2>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    ticket.status === "Resolved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {ticket.status || "Pending"}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>User:</strong> {ticket.userEmail}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {ticket.message}
              </p>

              {ticket.reply && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded mb-3">
                  <strong>Admin Reply:</strong> {ticket.reply}
                </div>
              )}

              {replyingTo === ticket._id ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full border dark:border-gray-700 rounded p-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                    rows="3"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(ticket._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Send Reply
                    </button>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setReplyingTo(ticket._id)}
                    className="text-blue-600 font-medium"
                  >
                    Reply
                  </button>
                  {ticket.status !== "Resolved" && (
                    <button
                      onClick={() => handleClose(ticket._id)}
                      className="text-green-600 font-medium"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
