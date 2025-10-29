"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import SocialLogin from "./SocialLogin";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const result = await signIn("credentials", { email, password, redirect: false });

    setLoading(false);

    if (result?.ok) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Logged in successfully!",
        showConfirmButton: false,
        timer: 1200,
      });
      router.push("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid email or password!",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl w-full max-w-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        Login to your account
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            minLength={6}
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center">or</p>
      <SocialLogin />
    </div>
  );
};

export default LoginForm;
