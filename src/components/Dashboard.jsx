import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { FaMoneyBillWave, FaChartLine, FaExchangeAlt, FaChartBar } from 'react-icons/fa';
import FondosCharts from "./FondosCharts";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Error al obtener datos");

        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();


  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">Fondo Inversión</h2>
        <nav className="nav-links">
          <Link to="/fondos">Fondos de Inversión</Link>
          <Link to="/transacciones">Mis Transacciones</Link>
          <Link to="/login" onClick={() => localStorage.removeItem("token")}>Cerrar Sesión</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="top-bar">
          <div className="welcome-card">
            <div className="welcome-text">
              <h2>Hola {userData.nombre || 'Usuario'}!</h2>
              <p>¡Bienvenido al panel de administración de tu fondo de inversión!</p>
            </div>
            <div className="welcome-icon">👋</div>
          </div>


        </div>

        {/* Info Boxes */}
        <div className="info-cards">
          <div className="info-box monto-disponible">
            <div className="info-icon"><FaMoneyBillWave /></div>
            <div className="title">Monto Disponible</div>
            <div className="value">${userData.balance ? userData.balance.toLocaleString() : 'Cargando...'}</div>
          </div>

          <div className="info-box monto-invertido">
            <div className="info-icon"><FaChartLine /></div>
            <div className="title">Monto Invertido</div>
            <div className="value">${userData.suscripciones?.reduce(
              (sum, s) => sum + s.monto,
              0
            ).toLocaleString() || 0}</div>
          </div>

          <div className="info-box transacciones-realizadas">
            <div className="info-icon"><FaExchangeAlt /></div>
            <div className="title">Transacciones Realizadas</div>
            <div className="value">{userData.transactions ? userData.transactions.length : 0}</div>
          </div>

          <div className="info-box inversiones-activas">
            <div className="info-icon"><FaChartBar /></div>
            <div className="title">Inversiones Activas</div>
            <div className="value">{userData.suscripciones ? userData.suscripciones.length : 0}</div>
          </div>
        </div>

        {/* 📊 Gráficas Dinámicas de Fondos */}
        <div style={{ marginTop: "40px" }}>
          <FondosCharts />
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
