"use client";

import Lottie from "lottie-react";
import TravellerAnimated from "@/assets/lottie/Generate-Initial.json"; // ✅ direct import (Next.js supports public import)

export default function LoginAnimation() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Lottie
        animationData={TravellerAnimated}
        loop={true} // play repeatedly
        style={{ height: 300, width: 300 }}
      />
    </div>
  );
}
