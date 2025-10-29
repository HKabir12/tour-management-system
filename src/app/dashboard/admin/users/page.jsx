"use client";

import React, { useEffect, useState } from "react";
import { Users, Shield, User, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Role Badge Component
const RoleBadge = ({ role }) => {
  let classes = "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  let Icon = User;

  if (role === "admin") {
    classes = "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    Icon = Shield;
  } else if (role === "moderator") {
    classes = "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    Icon = User;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full capitalize ${classes}`}>
      <Icon size={14} />
      {role}
    </span>
  );
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch users from database
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok || res.status === 200) setUsers(data);
      else toast.error(data.error || "Failed to fetch users");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Change user role
  const handleRoleChange = async (userId, currentRole) => {
    setUpdatingId(userId);
    const newRole = currentRole === "moderator" ? "user" : "moderator";
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Role updated successfully");
        fetchUsers();
      } else toast.error(data.error || "Failed to update role");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else toast.error(data.error || "Failed to delete user");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
        <p className="ml-3 text-lg text-gray-700 dark:text-gray-300">Fetching users...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 p-4 sm:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 dark:text-gray-100 flex items-center">
          <Users className="mr-3 h-7 w-7 text-blue-600 dark:text-blue-400" />
          Users Management
        </h1>

        <div className="dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          {users.length === 0 ? (
            <p className="p-10 text-center text-gray-500 dark:text-gray-400">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-base-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Registered On</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-base-300 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user, idx) => {
                    const isUpdating = updatingId === user._id;
                    return (
                      <tr key={user._id} className="hover:bg-gray-50 hover:text-black dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">{idx + 1}</td>
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4 text-blue-600 dark:text-blue-400 truncate max-w-xs">{user.email}</td>
                        <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                        <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-center space-x-2">
                          {user.role !== "admin" && (
                            <button
                              onClick={() => handleRoleChange(user._id, user.role)}
                              disabled={isUpdating}
                              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-xl shadow-md transition-colors ${
                                user.role === "moderator" ? "bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50" : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                              }`}
                            >
                              {user.role === "moderator" ? <ChevronDown size={14} className="mr-1" /> : <ChevronUp size={14} className="mr-1" />}
                              {user.role === "moderator" ? "Demote" : "Promote"}
                            </button>
                          )}

                          {user.role !== "admin" && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={isUpdating}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-xl shadow-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}

                          {user.role === "admin" && <span className="text-xs text-gray-400 italic">Protected</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
