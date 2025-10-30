"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface UpdatePaymentResponse {
  message?: string;
  error?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId: string | null = searchParams.get("session_id");
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!sessionId) {
        setMessage("No session ID found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/stripe/update-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data: UpdatePaymentResponse = await res.json();

        if (res.ok) {
          setMessage("Payment confirmed! Your booking is now paid.");
          setTimeout(() => {
            router.push("/dashboard/user/bookings");
          }, 3000);
        } else {
          setMessage(data.error || "Payment verification failed. Please contact support.");
        }
      } catch (err: unknown) {
        console.error("Error updating payment:", err);
        setMessage("Error confirming payment. Please check your bookings.");
      } finally {
        setLoading(false);
      }
    };

    updatePaymentStatus();
  }, [sessionId, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-50">
      <h1 className="text-3xl font-bold text-green-700">
        🎉 Payment Successful!
      </h1>

      {loading ? (
        <p className="text-gray-700 mt-4">Confirming your payment...</p>
      ) : (
        <>
          <p className="text-gray-700 mt-4">{message}</p>
          <p className="text-gray-600 mt-2 text-sm">Session ID: {sessionId}</p>
          <button
            onClick={() => router.push("/dashboard/user/bookings")}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            View My Bookings
          </button>
        </>
      )}
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p>Loading payment confirmation...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
