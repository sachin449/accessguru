import React, { useState } from "react";

const AddUserModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [platforms, setPlatforms] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      name,
      email,
      platforms: platforms.split(",").map((platform) => platform.trim()),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
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
            <label className="block text-gray-700">Platforms</label>
            <input
              type="text"
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder="e.g., GitHub, AWS"
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
