"use client";

import { Suspense } from "react";
// import { Metadata } from "next";
import ToursContent from "./components/ToursContent";


// 👇 Optional, to prevent prerender issues
// export const dynamic = "force-dynamic";

// // 🧭 SEO Metadata (static defaults)
// export const metadata: Metadata = {
//   title: "Explore Beautiful Tours Across Bangladesh | PH Tour Management",
//   description:
//     "Discover and book exciting tour packages across Bangladesh. From Cox’s Bazar to Sylhet, explore amazing destinations with PH Tour Management.",
//   keywords: [
//     "Bangladesh tours",
//     "tour booking",
//     "travel packages",
//     "Cox’s Bazar",
//     "Sylhet",
//     "Dhaka",
//     "tour management system",
//   ],
//   openGraph: {
//     title: "Explore Beautiful Tours Across Bangladesh | PH Tour Management",
//     description:
//       "Find your next adventure with PH Tour Management. Book top-rated tours across Bangladesh.",
//     url: "https://yourdomain.com/tours",
//     siteName: "PH Tour Management",
//     images: [
//       {
//         url: "/og-image.jpg",
//         width: 1200,
//         height: 630,
//         alt: "PH Tour Management",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
// };

// 🧭 Page Component
export default function ToursPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading tours...</div>}>
      <ToursContent />
    </Suspense>
  );
}
