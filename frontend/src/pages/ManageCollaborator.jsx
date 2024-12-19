import React, { useEffect, useState } from "react";

const ManageCollaborator = () => {
  const [repos, setRepos] = useState([]); // State for repositories
  const [selectedRepo, setSelectedRepo] = useState(""); // State for selected repository
  const [username, setUsername] = useState(""); // State for collaborator username
  const [message, setMessage] = useState(""); // State for messages

  // Hardcoded GitHub Personal Access Token for development
  const token = "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"; // Replace with your actual PAT
  const orgName = "live-octa-cat"; // Replace with your organization name

  // Fetch repositories from a specific GitHub organization
  const fetchRepositories = async () => {
    console.log("GitHub Token:", token); // Log to verify token is accessible

    try {
      const response = await fetch(`https://api.github.com/orgs/${orgName}/repos`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      console.log("Fetched Repositories:", data); // Log fetched data for debugging
      setRepos(data); // Set fetched repositories in state
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  useEffect(() => {
    fetchRepositories(); // Fetch repositories on component mount
  }, []);

  // Handle adding collaborator
  const handleAddCollaborator = async () => {
    if (!selectedRepo || !username) {
      alert("Please select a repository and enter a username.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${selectedRepo}/collaborators/${username}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.status === 201) {
        setMessage(`Successfully added ${username} as a collaborator!`);
      } else if (response.status === 404) {
        setMessage(`User ${username} not found.`);
      } else {
        setMessage(`Failed to add collaborator. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding collaborator:", error);
      setMessage("An error occurred while adding collaborator.");
    }
  };

  // Handle removing collaborator
  const handleRemoveCollaborator = async () => {
    if (!selectedRepo || !username) {
      alert("Please select a repository and enter a username.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${selectedRepo}/collaborators/${username}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.status === 204) {
        setMessage(`Successfully removed ${username} as a collaborator!`);
      } else if (response.status === 404) {
        setMessage(`User ${username} not found or not a collaborator.`);
      } else {
        setMessage(`Failed to remove collaborator. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error removing collaborator:", error);
      setMessage("An error occurred while removing collaborator.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Collaborators</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Select Repository</label>
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        >
          <option value="">-- Select Repository --</option>
          {repos.length > 0 ? (
            repos.map((repo) => (
              <option key={repo.id} value={repo.full_name}>
                {repo.full_name} {/* Displaying full name for clarity */}
              </option>
            ))
          ) : (
            <option disabled>No repositories found.</option>
          )}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Enter Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          placeholder="GitHub Username"
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleAddCollaborator}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Collaborator
        </button>

        <button
          onClick={handleRemoveCollaborator}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Remove Collaborator
        </button>
      </div>

      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
};

export default ManageCollaborator;
