// AddUserModal.js
import React, { useState } from "react";

const AddUserModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [platforms, setPlatforms] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const platformsArray = platforms.split(",").map((platform) => {
      const [platformName, accountId] = platform.trim().split(":");
      return {
        platformName: platformName.trim(),
        accountId: accountId ? accountId.trim() : "",
        status: "active",
      };
    });

    onAdd({
      name,
      email,
      platforms: platformsArray,
    });

    setName("");
    setEmail("");
    setPlatforms("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">Platforms</label>
            <input
              type="text"
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., GitHub:johndoe, AWS:tej"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;