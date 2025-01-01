export const getEmployees = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch("http://localhost:5000/api/employees", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  return response.json();
};

export const deleteEmployee = async (id) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }
  return response.json();
};

export const addEmployee = async (employee) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch("http://localhost:5000/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(employee),
  });
  if (!response.ok) {
    throw new Error("Failed to add employee");
  }
  return response.json();
};