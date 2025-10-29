import React from "react";
import { LoaderThree } from "@/components/ui/loader";

export function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // horizontal center
        alignItems: "center",     // vertical center
        height: "100vh",          // full viewport height
        width: "100%",            // full width
      }}
    >
      <LoaderThree />
    </div>
  );
}
