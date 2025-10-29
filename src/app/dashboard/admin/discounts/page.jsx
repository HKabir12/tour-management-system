"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Tag,
  Percent,
  DollarSign,
  Plus,
  Zap,
  Trash2,
  Loader2,
  PowerOff,
  X,
} from "lucide-react";

// Inline Alert Component
const InlineAlert = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl ${bgColor} text-white flex items-center gap-3`}>
      <span>{message}</span>
      <button onClick={onClose}><X size={16} /></button>
    </div>
  );
};

// Status Badge
const DiscountStatusBadge = ({ status }) => {
  const classes = status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700";
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {status || "inactive"}
    </span>
  );
};

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDiscountData, setNewDiscountData] = useState({
    code: "",
    description: "",
    value: 0,
    discountType: "percentage",
    validFrom: new Date().toISOString().split("T")[0],
    validTo: "2099-12-31",
  });

  const closeAlert = () => setAlert(null);

  // Fetch discounts from backend
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/discounts");
      const data = await res.json();
      if (res.ok) setDiscounts(data.discounts || data);
      else toast.error(data.error || "Failed to fetch discounts");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch discounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Create new discount
  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    setUpdatingId("new");
    try {
      const res = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDiscountData),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscounts((prev) => [...prev, data.discount]);
        setAlert({ message: `Discount ${data.discount.code} created!`, type: "success" });
        setShowCreateForm(false);
        setNewDiscountData({
          code: "",
          description: "",
          value: 0,
          discountType: "percentage",
          validFrom: new Date().toISOString().split("T")[0],
          validTo: "2099-12-31",
        });
      } else {
        toast.error(data.error || "Failed to create discount");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create discount");
    } finally {
      setUpdatingId(null);
    }
  };

  // Update status
  const handleStatusChange = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/discounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus === "active" ? "inactive" : "active" }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscounts((prev) =>
          prev.map((d) => (d._id === id ? { ...d, status: data.discount.status } : d))
        );
        setAlert({ message: `Status updated to ${data.discount.status}`, type: "success" });
      } else toast.error(data.error || "Failed to update status");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete discount
  const handleDelete = async (id) => {
    setUpdatingId(id);
    setDeleteConfirmationId(null);
    try {
      const res = await fetch(`/api/discounts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setDiscounts((prev) => prev.filter((d) => d._id !== id));
        setAlert({ message: "Discount deleted", type: "success" });
      } else toast.error(data.error || "Failed to delete discount");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete discount");
    } finally {
      setUpdatingId(null);
    }
  };

  const CreateDiscountForm = () => (
    <form onSubmit={handleCreateDiscount} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
      <input
        type="text"
        placeholder="Code (e.g., BLACKFRIDAY)"
        value={newDiscountData.code}
        onChange={(e) =>
          setNewDiscountData({ ...newDiscountData, code: (e.target.value || "").toUpperCase() })
        }
        className="p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-100"
        required
      />
      <select
        value={newDiscountData.discountType}
        onChange={(e) => setNewDiscountData({ ...newDiscountData, discountType: e.target.value })}
        className="p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-100"
      >
        <option value="percentage">%</option>
        <option value="fixed">$</option>
      </select>
      <input
        type="number"
        placeholder="Value"
        value={newDiscountData.value}
        onChange={(e) => setNewDiscountData({ ...newDiscountData, value: parseFloat(e.target.value) || 0 })}
        className="p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-100"
        min="0"
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={newDiscountData.description}
        onChange={(e) => setNewDiscountData({ ...newDiscountData, description: e.target.value || "" })}
        className="p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-100"
      />
      <input
        type="date"
        value={newDiscountData.validFrom}
        onChange={(e) => setNewDiscountData({ ...newDiscountData, validFrom: e.target.value || new Date().toISOString().split("T")[0] })}
        className="p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-100"
      />
      <input
        type="date"
        value={newDiscountData.validTo}
        onChange={(e) => setNewDiscountData({ ...newDiscountData, validTo: e.target.value || "2099-12-31" })}
        className="p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-100"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Create</button>
    </form>
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-base-100 dark:bg-gray-900">
      <Toaster />
      <InlineAlert message={alert?.message} type={alert?.type} onClose={closeAlert} />

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Tag className="mr-2" /> Manage Promo Codes
        </h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          {showCreateForm ? "Close Form" : "Add New"}
        </button>
      </div>

      {showCreateForm && <CreateDiscountForm />}

      <div className="overflow-x-auto bg-base-300 dark:bg-gray-800 rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-base-100 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-left">Discount</th>
              <th className="px-3 py-2 text-left">Validity</th>
              <th className="px-3 py-2 text-center">Status</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-3 py-2">{d.code || "-"}</td>
                <td className="px-3 py-2">{d.description || "-"}</td>
                <td className="px-3 py-2">
                  {d.discountType === "percentage" ? (
                    <span className="flex items-center gap-1">
                      <Percent size={14} /> {d.value || 0}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <DollarSign size={14} /> {d.value || 0}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {(d.validFrom ? d.validFrom.split("T")[0] : "-")} to {(d.validTo ? d.validTo.split("T")[0] : "-")}
                </td>
                <td className="px-3 py-2 text-center">
                  <DiscountStatusBadge status={d.status} />
                </td>
                <td className="px-3 py-2 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleStatusChange(d._id, d.status)}
                    className="px-2 py-1 bg-green-600 text-white rounded-xl text-xs"
                  >
                    {d.status === "active" ? <PowerOff size={12} /> : <Zap size={12} />}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmationId(d._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded-xl text-xs"
                  >
                    <Trash2 size={12} />
                  </button>
                  {deleteConfirmationId === d._id && (
                    <div className="absolute bg-white dark:bg-gray-700 p-2 rounded-lg shadow-lg">
                      <p>Delete {d.code}?</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleDelete(d._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirmationId(null)}
                          className="px-2 py-1 bg-gray-300 text-black rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
