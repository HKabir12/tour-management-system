"use client";
import React, { useState } from "react";
import { Loader2, CheckCircle, XCircle, Plus, Minus } from "lucide-react";

const AddTourpackage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    image: "",
    activities: [""],
  });
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

  const closeModal = () => setModalMessage(null);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivityChange = (index, value) => {
    const updatedActivities = [...formData.activities];
    updatedActivities[index] = value;
    setFormData({ ...formData, activities: updatedActivities });
  };

  const addActivityField = () =>
    setFormData({ ...formData, activities: [...formData.activities, ""] });

  const removeActivityField = (index) => {
    const updatedActivities = formData.activities.filter((_, i) => i !== index);
    setFormData({ ...formData, activities: updatedActivities });
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalMessage(null);

    try {
      const res = await fetch("/api/tour-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setModalMessage({
          title: "Success!",
          text: "Tour Package added successfully.",
          success: true,
        });

        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          duration: "",
          image: "",
          activities: [""],
        });
      } else {
        const errData = await res.json();
        setModalMessage({
          title: "Submission Failed",
          text: errData.error || "Could not add the package. Please try again.",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage({
        title: "Network Error",
        text: "The server could not be reached. Please check your connection.",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 flex items-start justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl bg-base-300 dark:bg-gray-800 shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center dark:text-gray-100">
          Add Tour Package
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              type="text"
              name="title"
              placeholder="Package Title (e.g., Swiss Alps Adventure)"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <InputField
              type="text"
              name="duration"
              placeholder="Duration (e.g., 5 Days / 4 Nights)"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Detailed description of the tour package."
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 h-32 bg-base-100 dark:bg-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              type="number"
              name="price"
              placeholder="Price (in USD)"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
            />
            <InputField
              type="text"
              name="image"
              placeholder="Image URL (e.g., https://example.com/tour.jpg)"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-base-100 dark:bg-gray-700">
            <label className="font-semibold dark:text-gray-100 block mb-3">
              Included Activities:
            </label>
            <div className="space-y-3">
              {formData.activities.map((activity, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => handleActivityChange(index, e.target.value)}
                    placeholder={`Activity ${index + 1}`}
                    className="flex-grow border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:text-gray-100 bg-base-300 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {formData.activities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeActivityField(index)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
                    >
                      <Minus size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addActivityField}
              className="mt-4 flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors font-medium shadow-md"
            >
              <Plus size={18} /> Add Activity
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Processing...
              </>
            ) : (
              "Add Package"
            )}
          </button>
        </form>
      </div>

      {modalMessage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm text-center transform transition-transform duration-300 scale-100">
            <div className="flex justify-center mb-4">
              {modalMessage.success ? (
                <CheckCircle size={56} className="text-green-500" />
              ) : (
                <XCircle size={56} className="text-red-500" />
              )}
            </div>
            <h4 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
              {modalMessage.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{modalMessage.text}</p>
            <button
              onClick={closeModal}
              className={`px-8 py-3 rounded-xl font-semibold transition-colors shadow-md w-full
                ${modalMessage.success ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ name, type, placeholder, value, onChange, required, min }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-base-100 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
    required={required}
    min={min}
  />
);

export default AddTourpackage;
