import React, { useEffect, useState } from "react";
import EmployeeTable from "./EmployeeTable";
import AddUserModal from "./AddUserModal";
import { getEmployees, deleteEmployee, addEmployee  } from "../services/employeeService";


const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle deleting an employee
  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Handle adding a new employee
  const handleAdd = async (newEmployee) => {
    try {
      const addedEmployee = await addEmployee(newEmployee);
      setEmployees([...employees, addedEmployee]);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add User
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <EmployeeTable employees={employees} onDelete={handleDelete} />
      )}
      {isModalOpen && (
        <AddUserModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default Dashboard;
