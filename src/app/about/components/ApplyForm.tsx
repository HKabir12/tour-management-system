"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, UserPlus } from "lucide-react";

export default function ApplyForm() {
  const [form, setForm] = useState({ name: "", email: "", position: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch("/api/teamApplications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess(data.message);
      setForm({ name: "", email: "", position: "" });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="flex items-center justify-center max-w-2xl mx-auto gap-2">
          <UserPlus className="w-5 h-5" /> Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join Our Team</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter your name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="position">Preferred Role</Label>
            <Input id="position" placeholder="e.g. Tour Guide, Manager" value={form.position} onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : <><Mail className="w-4 h-4 mr-2" /> Submit Application</>}
          </Button>
          {success && <p className="text-green-600 mt-2">{success}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}
