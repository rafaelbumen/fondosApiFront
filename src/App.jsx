import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Registro from "./pages/Registro";
import DashboardPage from "./pages/DashboardPage";  // Página de Dashboard
import LoginPage from "./pages/LoginPage";  // Página de Login
import FondosPage from "./pages/FondosPage"; 
import TransaccionesPage from "./pages/TransaccionesPage"; 
import React, { useState } from "react";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={<Registro setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route path="/fondos" element={<FondosPage />} />
        <Route path="/Transacciones" element={<TransaccionesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
