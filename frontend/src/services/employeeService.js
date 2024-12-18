export const getEmployees = async () => {
  const response = await fetch("http://localhost:5000/api/employees");
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  return response.json();
};

export const deleteEmployee = async (id) => {
  const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }
  return response.json();
};

export const addEmployee = async (employee) => {
  const response = await fetch("http://localhost:5000/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });
  if (!response.ok) {
    throw new Error("Failed to add employee");
  }
  return response.json();
};
