"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function PaymentHistory() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stripe/payment?email=${session.user.email}`);
        const data = await res.json();
        console.log("Fetched payments:", data.payments);
        setPayments(data.payments || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [session]);

  if (!session) return <p className="p-6">Please log in to see your payment history.</p>;
  if (loading) return <p className="p-6">Loading payments...</p>;

  return (
    <div className=" max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💳 Payment History</h1>

      {payments.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className=" border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Tour</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3 border">{p.metadata?.tourTitle || "N/A"}</td>
                  <td className="p-3 border">${(p.amount_total / 100).toFixed(2)}</td>
                  <td className="p-3 border">{p.payment_status}</td>
                  <td className="p-3 border">{new Date(p.created * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
