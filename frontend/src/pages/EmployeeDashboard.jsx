import React, { useEffect, useState } from "react";
import { getEmployees, deleteEmployee, addEmployee } from "../services/employeeService";
import AddUserModal from "./AddUserModal";
import config from "../config";
import { FiPlus, FiSearch, FiGithub, FiTrash2, FiUserPlus, FiUserMinus, FiLoader } from "react-icons/fi";

const EmployeeDashboard = () => {
  const { token, orgName } = config.github;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);


  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to load employees. Please try again later.");
      setLoading(false);
    }
  };

  const fetchRepositories = async () => {
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
      setRepos(data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setError("Failed to fetch repositories. Please check your connection.");
    }
  };

  useEffect(() => {
    Promise.all([fetchEmployees(), fetchRepositories()]);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setIsProcessing(true);
      try {
        await deleteEmployee(id);
        setEmployees(employees.filter((employee) => employee._id !== id));
        setSelectedEmployeeId("");
      } catch (error) {
        setError("Failed to delete employee. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCollaboratorAction = async (action) => {
    if (!selectedRepo || !selectedEmployeeId) {
      setError("Please select both a repository and an employee.");
      return;
    }

    setIsProcessing(true);
    const selectedEmployee = employees.find(emp => emp._id === selectedEmployeeId);
    const githubUsername = selectedEmployee.platforms[0]?.accountId;

    try {
      const response = await fetch(
        `https://api.github.com/repos/${selectedRepo}/collaborators/${githubUsername}`,
        {
          method: action === 'add' ? 'PUT' : 'DELETE',
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.status === 201 || response.status === 204) {
        const message = action === 'add' 
          ? `Successfully added ${githubUsername} as a collaborator!`
          : `Successfully removed ${githubUsername} as a collaborator!`;
        alert(message);
      } else {
        throw new Error(`Failed with status: ${response.status}`);
      }
    } catch (error) {
      setError(`Failed to ${action} collaborator. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-lg">
          <FiLoader className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="text-gray-700 font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 px-8 py-6">
      <div className="container mx-auto bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Management
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600
            text-white font-medium rounded-lg transition-all duration-200 
            disabled:opacity-50"
            disabled={isProcessing}
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Employee
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              ×
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 
              focus:ring focus:ring-blue-200 transition-colors disabled:opacity-50"
              disabled={isProcessing}
            >
              <option value="">Select Repository</option>
              {repos.map((repo) => (
                <option key={repo.id} value={repo.full_name}>
                  {repo.full_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg 
              focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">#</th>
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Email</th>
                <th scope="col" className="px-4 py-3">Platform</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredEmployees.map((employee, index) => (
                <tr 
                  key={employee._id}
                  className={`border-b hover:bg-gray-50 ${selectedEmployeeId === employee._id ? "bg-gray-50" : ""}`}
                >
                  <td className="px-4 py-3 text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{employee.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-green-600">{employee.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    {employee.platforms.map((platform) => (
                      <div key={platform._id} className="flex items-center text-gray-500">
                        <FiGithub className="w-4 h-4 mr-2" />
                        <span className="font-medium text-gray-900">{platform.accountId}</span>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                      ${employee.platforms[0]?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"}`}
                    >
                      {employee.platforms[0]?.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedEmployeeId(employee._id)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50
                          ${selectedEmployeeId === employee._id
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        disabled={isProcessing}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600 
                          hover:bg-red-100 transition-colors disabled:opacity-50"
                        disabled={isProcessing}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Collaborator Actions */}
        {selectedRepo && selectedEmployeeId && (
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => handleCollaboratorAction('add')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg
                hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isProcessing}
            >
              <FiUserPlus className="w-4 h-4 mr-2" />
              Add Collaborator
            </button>
            <button
              onClick={() => handleCollaboratorAction('remove')}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg
                hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={isProcessing}
            >
              <FiUserMinus className="w-4 h-4 mr-2" />
              Remove Collaborator
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddUserModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={async (newEmployee) => {
            setIsProcessing(true);
            try {
              const addedEmployee = await addEmployee(newEmployee);
              setEmployees(prev => [...prev, addedEmployee]);
              setIsModalOpen(false);
            } catch (error) {
              setError("Failed to add employee. Please try again.");
            } finally {
              setIsProcessing(false);
            }
          }} 
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;