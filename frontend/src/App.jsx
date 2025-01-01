// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from './pages/MainDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuth } = useAuth();
  
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/github"
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Redirect any unknown routes to main dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import MainDashboard from './pages/MainDashboard';
// import EmployeeDashboard from './pages/EmployeeDashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<MainDashboard />} />
//         <Route path="/github" element={<EmployeeDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;