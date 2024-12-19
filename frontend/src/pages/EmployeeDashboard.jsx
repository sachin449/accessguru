import React, { useEffect, useState } from "react";
import { getEmployees, deleteEmployee, addEmployee } from "../services/employeeService"; // Adjust path as necessary
import AddUserModal from "./AddUserModal"; // Importing AddUserModal

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      console.log("Fetched Employees:", data); // Log fetched data for debugging
      setEmployees(data); // Ensure this data is an array
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle deleting an employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        setEmployees(employees.filter((employee) => employee._id !== id));
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee.");
      }
    }
  };

  // Handle adding a new employee
  const handleAdd = async (newEmployee) => {
    try {
      const addedEmployee = await addEmployee(newEmployee);
      console.log("Added Employee:", addedEmployee); // Log added employee
      setEmployees((prevEmployees) => [...prevEmployees, addedEmployee]); // Update state with new employee
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Employee Management</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setIsModalOpen(true)} // Open modal on button click
      >
        Add Employee
      </button>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Platforms</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="py-4 px-6 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(employees) && employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="py-3 px-6 whitespace-nowrap">{employee.name}</td>
                  <td className="py-3 px-6 whitespace-nowrap">{employee.email}</td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    {employee.platforms.map((platform) => (
                      <div key={platform._id} className="text-sm text-gray-600">
                        {platform.platformName}: {platform.accountId}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap">{employee.platforms[0]?.status || 'N/A'}</td>
                  <td className="py-3 px-6 whitespace-nowrap text-center">
                    <button
                      className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 px-4 rounded transition duration-150 ease-in-out"
                      onClick={() => handleDelete(employee._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <AddUserModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
