import React from "react";

const EmployeeTable = ({ employees, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-sm uppercase font-semibold">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Platforms</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Registered At</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id} className="border-b">
              <td className="py-3 px-6">{employee.name}</td>
              <td className="py-3 px-6">{employee.email}</td>
              <td className="py-3 px-6">{employee.platforms.join(", ")}</td>
              <td className="py-3 px-6">{employee.status}</td>
              <td className="py-3 px-6 text-center">
                {new Date(employee.registeredAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded"
                  onClick={() => onDelete(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
