import React, { useEffect, useState } from "react";

const ManageCollaborator = () => {
  const [repos, setRepos] = useState([]); 
  const [selectedRepo, setSelectedRepo] = useState(""); 
  const [username, setUsername] = useState(""); 
  const [message, setMessage] = useState(""); 

  const token = "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"; 
  const orgName = "live-octa-cat"; 

  const fetchRepositories = async () => {
    console.log("GitHub Token:", token); 

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
      console.log("Fetched Repositories:", data); 
      setRepos(data); 
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  useEffect(() => {
    fetchRepositories(); 
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
                {repo.full_name} 
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
