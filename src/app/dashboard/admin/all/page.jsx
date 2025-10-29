"use client";

import React, { useEffect, useState } from "react";
import { XCircle, CheckCircle, Loader2, Trash2, Edit } from "lucide-react";

// --- Custom Modal Component ---
const CustomModal = ({ isOpen, onClose, title, text, success, onConfirm, isConfirmation, isProcessing }) => {
  if (!isOpen) return null;

  const Icon = success ? CheckCircle : XCircle;
  const iconColor = success ? "text-green-500" : "text-red-500";
  const confirmButtonColor = isConfirmation ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700";
  const cancelButtonColor = isConfirmation ? "bg-gray-400 hover:bg-gray-500" : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm text-center transform transition-transform duration-300 scale-100">
        <div className="flex justify-center mb-4">
          <Icon size={48} className={iconColor} />
        </div>
        <h4 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
          {title}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{text}</p>
        
        <div className="flex justify-center gap-4">
          {isConfirmation ? (
            <>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors text-white shadow-md ${cancelButtonColor} disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors text-white shadow-md flex items-center justify-center ${confirmButtonColor} disabled:opacity-50`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors text-white shadow-md ${confirmButtonColor}`}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- TourPackagesPage ---
const TourPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmState, setConfirmState] = useState({ isOpen: false, id: null, title: "", text: "" });
  const [notificationState, setNotificationState] = useState({ isOpen: false, title: "", text: "", success: false });
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Fetch packages from API ---
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tour-packages");
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      setNotificationState({
        isOpen: true,
        title: "Fetch Error",
        text: "Could not load tour packages from the server.",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Trigger confirmation modal for deletion ---
  const handleDeleteClick = (id, title) => {
    setConfirmState({
      isOpen: true,
      id,
      title: "Confirm Deletion",
      text: `Are you sure you want to delete the package: "${title}"? This action cannot be undone.`,
    });
  };

  // --- Delete package via API ---
  const confirmDeletion = async () => {
    if (!confirmState.id) return;
    const idToDelete = confirmState.id;

    setConfirmState({ ...confirmState, isOpen: false });
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/tour-packages/${idToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setPackages(packages.filter((pkg) => pkg._id !== idToDelete));
        setNotificationState({
          isOpen: true,
          title: "Deletion Successful",
          text: "The tour package has been successfully deleted.",
          success: true,
        });
      } else {
        const errData = await res.json();
        setNotificationState({
          isOpen: true,
          title: "Deletion Failed",
          text: errData.error || "Failed to delete the package.",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      setNotificationState({
        isOpen: true,
        title: "Network Error",
        text: "Could not connect to the server.",
        success: false,
      });
    } finally {
      setIsDeleting(false);
      setConfirmState({ isOpen: false, id: null, title: "", text: "" });
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  if (loading) return <p className="text-center mt-10 text-xl text-gray-600 dark:text-gray-400">Loading Tour Packages...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4 sm:p-6 bg-base-300 dark:bg-gray-900 shadow-xl rounded-2xl min-h-[500px]">
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold dark:text-gray-100">Manage Tour Packages</h1>
        <a
          href="/dashboard/admin/add/tours"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
        >
          + Add New Package
        </a>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No tour packages found. Click above to add one!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="dark:bg-gray-700">
              <tr className="text-left text-xs font-medium dark:text-gray-300 uppercase tracking-wider">
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3 w-32">Price</th>
                <th className="px-6 py-3 w-32">Duration</th>
                <th className="px-6 py-3 text-center w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {packages.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-gray-50 hover:text-black dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium dark:text-gray-100">{pkg.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300 font-mono">${pkg.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{pkg.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-3">
                    <a
                      href={`/dashboard/admin/edit/${pkg._id}`}
                      className="inline-flex items-center bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </a>
                    <button
                      onClick={() => handleDeleteClick(pkg._id, pkg.title)}
                      disabled={isDeleting}
                      className="inline-flex items-center bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <CustomModal 
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
        onConfirm={confirmDeletion}
        title={confirmState.title}
        text={confirmState.text}
        isConfirmation={true}
        isProcessing={isDeleting}
        success={false}
      />

      {/* Notification Modal */}
      <CustomModal
        isOpen={notificationState.isOpen}
        onClose={() => setNotificationState({ ...notificationState, isOpen: false })}
        title={notificationState.title}
        text={notificationState.text}
        success={notificationState.success}
        isConfirmation={false}
        isProcessing={false}
      />
    </div>
  );
};

export default TourPackagesPage;
