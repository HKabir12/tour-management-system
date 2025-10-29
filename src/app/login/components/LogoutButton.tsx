"use client";
import React from "react";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
    localStorage.removeItem("group");
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-neutral rounded-xl text-white"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
