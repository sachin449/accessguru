import React, { useState } from "react";

const AddUserModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [platforms, setPlatforms] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare platforms as an array of objects
    const platformsArray = platforms.split(",").map((platform) => {
      const [platformName, accountId] = platform.trim().split(":");
      return {
        platformName: platformName.trim(),
        accountId: accountId ? accountId.trim() : "", // Handle cases where accountId is not provided
        status: "active", // Default status
      };
    });

    // Call onAdd with structured data
    onAdd({
      name,
      email,
      platforms: platformsArray,
    });

    // Reset form fields
    setName("");
    setEmail("");
    setPlatforms("");
    
    // Close modal after submission
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Platforms (format: Platform:AccountID)</label>
            <input
              type="text"
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder="e.g., GitHub:johndoe, AWS:tej"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
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
