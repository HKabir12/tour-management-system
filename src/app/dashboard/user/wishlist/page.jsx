
"use client";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  // from auth later

  useEffect(() => {
    fetch(`/api/wishlist`)
      .then((res) => res.json())
      .then(setWishlist);
  }, []);

  const removeItem = async (id) => {
    await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Wishlist 💖</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item._id} className="border rounded-xl p-4 shadow-sm">
            <img src={item.tourImage} className="rounded-lg mb-2" />
            <h3 className="font-semibold">{item.tourTitle}</h3>
            <p className="text-gray-600">${item.price}</p>
            <button
              onClick={() => removeItem(item._id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
