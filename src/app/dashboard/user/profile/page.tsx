"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/utilities/Loader";
import { Pencil } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role:"use" |"admin"| "moderator"
}

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users?email=${session.user.email}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data: User = await res.json();
        setUser(data);
        setName(data.name);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session?.user?.email]);

  const handleUpdate = async () => {
    if (!user) return;

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role: user.role || "user", // send existing role or a default
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to update profile");
      }

      const updatedUser: User = await res.json();
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    }
  };

  if (loading) return <Loader />;
  if (!user)
    return <p className="text-gray-500 text-center mt-10">User not found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10  rounded-xl shadow-lg p-6 text-center">
      {/* Avatar */}
      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
        <Image
          src={user.image || "/default-avatar.png"}
          alt="Profile Image"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2  rounded-full p-2 cursor-pointer">
          <Pencil
            size={16}
            className="text-white"
            onClick={() => setEditing(true)}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-6">
        {editing ? (
          <div className="flex flex-col gap-3 items-center">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg font-semibold text-center"
            />
            <div className="flex gap-2">
              <Button onClick={handleUpdate}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.name}
            </h1>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-400 text-sm mt-1">USER ID: {user._id}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
