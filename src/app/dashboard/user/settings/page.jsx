"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  // profile form state
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  // notifications
  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    paymentReceipts: true,
    supportReplies: true,
  });

  // password change
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.id) return;
    // fetch user data from server
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/settings");
        const data = await res.json();
        if (res.ok && data.success) {
          setUser(data.user);
          setName(data.user.name || "");
          setImage(data.user.image || "");
          setPreview(data.user.image || "");
          setNotifications(data.user.notifications || notifications);
        } else {
          // fallback if API didn't return success (still set fields from session)
          setUser({ name: session.user.name, email: session.user.email });
          setName(session.user.name || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session, status]);

  if (status === "loading") return <p className="p-6">Loading...</p>;
  if (!session) return <p className="p-6">Please log in to access settings.</p>;

  // CLIENT upload to Cloudinary (unsigned)
  const handleImageUpload = async (file) => {
    if (!file) return;
    setSaving(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const res = await fetch(url, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data?.secure_url) {
        setImage(data.secure_url);
        setPreview(data.secure_url);
      } else {
        alert("Image upload failed. Check your Cloudinary preset and console.");
        console.error("Cloudinary response:", data);
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Image upload failed.");
    } finally {
      setSaving(false);
    }
  };

  // Save profile (name + image)
  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "profile", name, image }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Profile updated");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Save notifications
  const saveNotifications = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "notifications", notifications }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Notification preferences saved");
      } else {
        alert(data.error || "Failed to save notifications");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save notifications");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const changePassword = async () => {
    if (!currentPwd || !newPwd) {
      setPwdMessage("Please fill both fields.");
      return;
    }
    setPwdMessage("");
    setSaving(true);
    try {
      const res = await fetch("/api/users/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "password",
          currentPassword: currentPwd,
          newPassword: newPwd,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPwdMessage("Password changed successfully.");
        setCurrentPwd("");
        setNewPwd("");
      } else {
        setPwdMessage(data.error || "Password change failed.");
      }
    } catch (err) {
      console.error(err);
      setPwdMessage("Error changing password.");
    } finally {
      setSaving(false);
    }
  };

  // Clear user data (bookings & support tickets)
  const clearData = async () => {
    if (
      !confirm("This will delete your bookings and support tickets. Continue?")
    )
      return;
    setSaving(true);
    try {
      const res = await fetch("/api/users/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clearData" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Your bookings and support tickets were deleted.");
      } else {
        alert(data.error || "Failed to clear data.");
      }
    } catch (err) {
      console.error(err);
      alert("Error clearing data.");
    } finally {
      setSaving(false);
    }
  };

  // Delete account (soft delete)
  const deleteAccount = async () => {
    if (!confirm("Are you sure? This will deactivate your account.")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/users/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteAccount" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Account deactivated. You will be logged out.");
        signOut({ callbackUrl: "/" });
      } else {
        alert(data.error || "Failed to delete account.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <section className=" p-4 rounded-lg shadow space-y-3">
        <h2 className="text-lg font-semibold">Profile</h2>

        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden ">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              className="border p-2 w-full rounded mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />

            <div className="flex gap-2 items-center">
              <label className="cursor-pointer inline-block   px-3 py-2 rounded">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  className="hidden"
                />
              </label>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save profile
              </button>
            </div>
            {saving && <p className="text-sm text-gray-500 mt-2">Saving...</p>}
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className=" p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Notifications</h2>

        <label className="flex justify-between items-center mb-2">
          <span>Booking confirmations</span>
          <input
            type="checkbox"
            checked={!!notifications.bookingUpdates}
            onChange={(e) =>
              setNotifications({
                ...notifications,
                bookingUpdates: e.target.checked,
              })
            }
          />
        </label>

        <label className="flex justify-between items-center mb-2">
          <span>Payment receipts</span>
          <input
            type="checkbox"
            checked={!!notifications.paymentReceipts}
            onChange={(e) =>
              setNotifications({
                ...notifications,
                paymentReceipts: e.target.checked,
              })
            }
          />
        </label>

        <label className="flex justify-between items-center mb-2">
          <span>Admin replies to support tickets</span>
          <input
            type="checkbox"
            checked={!!notifications.supportReplies}
            onChange={(e) =>
              setNotifications({
                ...notifications,
                supportReplies: e.target.checked,
              })
            }
          />
        </label>

        <div className="mt-3 flex gap-2">
          <button
            onClick={saveNotifications}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save notification settings
          </button>
        </div>
      </section>

      {/* Password (only show if credential user) */}
      <section className=" p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Password</h2>
        <p className="text-sm text-gray-500 mb-3">
          Change your password (only available if you signed up with email &
          password).
        </p>
        <input
          type="password"
          value={currentPwd}
          onChange={(e) => setCurrentPwd(e.target.value)}
          placeholder="Current password"
          className="border p-2 w-full rounded mb-2"
        />
        <input
          type="password"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
          placeholder="New password"
          className="border p-2 w-full rounded mb-2"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={changePassword}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Change password
          </button>
          {pwdMessage && <p className="text-sm text-red-500">{pwdMessage}</p>}
        </div>
      </section>

      {/* Account actions */}
      <section className=" p-4 rounded-lg shadow space-y-3">
        <h2 className="text-lg font-semibold">Account</h2>
        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={clearData}
            disabled={saving}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Clear my data
          </button>
          <button
            onClick={deleteAccount}
            disabled={saving}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete my account
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className=" px-4 py-2 rounded"
          >
            Log out
          </button>
        </div>
      </section>
    </div>
  );
}
