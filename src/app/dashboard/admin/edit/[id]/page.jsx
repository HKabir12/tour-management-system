"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, Plus, Minus } from "lucide-react";

const EditPackagePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    image: "",
    activities: [""],
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [modalMessage, setModalMessage] = useState(null); // { title, text, success }

  // Fetch package details
  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) return;
      setFetching(true);
      try {
        const res = await fetch(`/api/tour-packages/${id}`);
        if (!res.ok) throw new Error("Failed to fetch package");
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setModalMessage({
          title: "Load Error",
          text: "Failed to load package data for editing.",
          success: false,
        });
      } finally {
        setFetching(false);
      }
    };
    fetchPackage();
  }, [id]);

  // Form handlers
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleActivityChange = (index, value) => {
    const updated = [...formData.activities];
    updated[index] = value;
    setFormData({ ...formData, activities: updated });
  };

  const addActivity = () => setFormData({ ...formData, activities: [...formData.activities, ""] });

  const removeActivity = (index) =>
    setFormData({ ...formData, activities: formData.activities.filter((_, i) => i !== index) });

  // Submit updated package
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalMessage(null);

    try {
      const res = await fetch(`/api/tour-packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalMessage({
          title: "Update Successful!",
          text: "Tour package updated successfully.",
          success: true,
        });
        setTimeout(() => router.push("/dashboard/admin/all"), 1500);
      } else {
        setModalMessage({
          title: "Update Failed",
          text: "Could not update package. Please try again.",
          success: false,
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      setModalMessage({
        title: "Network Error",
        text: "Failed to connect to the server.",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
        Edit Tour Package
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Title" name="title" value={formData.title} onChange={handleChange} />
        <TextareaField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <InputField label="Price" type="number" name="price" value={formData.price} onChange={handleChange} />
        <InputField label="Duration" name="duration" value={formData.duration} onChange={handleChange} />
        <InputField label="Image URL" name="image" value={formData.image} onChange={handleChange} />

        <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-700">
          <label className="font-semibold text-gray-800 dark:text-gray-100 block mb-2">Activities</label>
          {formData.activities.map((activity, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <input
                type="text"
                value={activity}
                onChange={(e) => handleActivityChange(index, e.target.value)}
                placeholder={`Activity ${index + 1}`}
                className="flex-grow border rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              {(formData.activities.length > 1 || index > 0) && (
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  className="bg-red-500 text-white px-3 rounded-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addActivity}
            className="mt-2 bg-green-500 text-white px-4 py-1 rounded-lg flex items-center gap-1"
          >
            <Plus size={16} /> Add Activity
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Package"}
        </button>
      </form>

      {/* Modal */}
      {modalMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <div className="flex justify-center mb-4">
              {modalMessage.success ? (
                <CheckCircle size={48} className="text-green-500" />
              ) : (
                <XCircle size={48} className="text-red-500" />
              )}
            </div>
            <h4 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{modalMessage.title}</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{modalMessage.text}</p>
            <button
              onClick={() => setModalMessage(null)}
              className={`w-full py-2 rounded-lg text-white font-semibold ${
                modalMessage.success ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="font-medium text-gray-700 dark:text-gray-200">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      required
    />
  </div>
);

const TextareaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="font-medium text-gray-700 dark:text-gray-200">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg p-2 h-24 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      required
    />
  </div>
);

export default EditPackagePage;
