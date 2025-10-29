"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";

interface FormState {
  name: string;
  email: string;
  password: string;
  image: File | null;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Handle text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Use FormData for file upload
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      if (formData.image) form.append("image", formData.image);

      const res = await fetch("/api/register", {
        method: "POST",
        body: form, // no headers — FormData handles it
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
      } else {
        setMessage("🎉 Registration successful!");
        setFormData({
          name: "",
          email: "",
          password: "",
          image: null,
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("Unexpected error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow"
    >
      <div>
        <Label htmlFor="name" className="pb-2">
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="email" className="pb-2">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="password" className="pb-2">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter a strong password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="image" className="pb-2">
          Upload Profile Image
        </Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>

      {message && (
        <p className="text-center text-sm mt-2 text-blue-600">{message}</p>
      )}
    </form>
  );
};

export default RegisterForm;
