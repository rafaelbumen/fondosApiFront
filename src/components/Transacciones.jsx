import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Transacciones.css";

export default function Transacciones() {
  const [user, setUser] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">Fondo Inversión</h2>
        <nav className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/fondos">Fondos de Inversión</Link>
          <Link to="/transacciones">Mis Transacciones</Link>
          <Link to="/login" onClick={() => localStorage.removeItem("token")}>Cerrar Sesión</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="top-bar">
          <div className="welcome-card">
            <div className="welcome-text">
              <h2>Hola {user?.nombre || "usuario"}!</h2>
              <p>¡Bienvenido al panel de administración de tu fondo de inversión!</p>
            </div>
            <div className="welcome-icon">👋</div>
          </div>
        </div>

        <h2 className="seccion-titulo">Mis Transacciones</h2>

        <div className="transacciones-table">
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Fondo</th>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {user?.transactions?.map((t) => (
                <tr key={t.id}>
                  <td>{t.tipo}</td>
                  <td>{t.fondoNombre}</td>
                  <td>${t.monto.toLocaleString()}</td>
                  <td>{t.descripcion}</td>
                  <td>{new Date(t.fecha).toLocaleString("es-CO")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
