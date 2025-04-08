import React, { useEffect, useState } from "react";
import "./Fondos.css";
import { Link } from "react-router-dom";

export default function Fondos() {
  const [fondos, setFondos] = useState([]);
  const [selectedFondo, setSelectedFondo] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [montoAportar, setMontoAportar] = useState("");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const resFondos = await fetch(`${API}/fondos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fondosData = await resFondos.json();
      setFondos(fondosData);

      const resUser = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await resUser.json();
      setUserData(user);
    };

    fetchData();
  }, []);

  const abrirModal = (fondo) => {
    setSelectedFondo(fondo);

    const sus = userData.suscripciones?.find((s) => s.fondoId === fondo.id);
    setSuscripcion(sus || null);
    setMontoAportar(sus ? sus.monto : "");
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setSelectedFondo(null);
    setSuscripcion(null);
    setMontoAportar("");
  };

  const manejarSuscripcion = async () => {
    const token = localStorage.getItem("token");

    if (!suscripcion) {
      if (montoAportar < selectedFondo.montoMinimo) {
        alert(`Debes aportar mínimo $${selectedFondo.montoMinimo.toLocaleString()}`);
        return;
      }

      const res = await fetch(`${API}/suscripciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userData.id,
          fondoId: selectedFondo.id,
          monto: parseInt(montoAportar),
        }),
      });

      if (res.ok) alert("✅ Suscripción exitosa");
    } else {
      const res = await fetch(`${API}/suscripciones`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userData.id,
          fondoId: selectedFondo.id,
        }),
      });

      if (res.ok) alert("🚫 Te has salido del fondo");
    }

    cerrarModal();
    window.location.reload(); // recarga el estado
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">Fondo Inversión</h2>
        <nav className="nav-links">
          <a href="/dashboard">Dashboard</a>
          <Link to="/fondos">Fondos de Inversión</Link>
          <Link to="/transacciones">Mis Transacciones</Link>
          <Link to="/consignar">Consignar</Link>
          <Link to="/perfil">Mi Información</Link>
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

        <div className="fondos-container">
          {fondos.map((fondo, i) => (
            <div key={fondo.id} className="fondo-card" onClick={() => abrirModal(fondo)}>
              <h3>Fondo {i + 1}</h3>
              <p>{fondo.nombre}</p>
              <p>Categoría: {fondo.categoria}</p>
              <p>Mínimo: ${fondo.montoMinimo.toLocaleString()}</p>
              <p>Aportes: ${fondo.totalAportes.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {modalOpen && selectedFondo && (
          <div className="modal">
            <div className="modal-content">
              <h2>{selectedFondo.nombre}</h2>
              <p>Categoría: {selectedFondo.categoria}</p>
              <p>Aportes: ${selectedFondo.totalAportes.toLocaleString()}</p>
              {suscripcion ? (
                <>
                  <p>💰 Inversión: ${suscripcion.monto.toLocaleString()}</p>
                  <button onClick={manejarSuscripcion}>Salir del fondo</button>
                </>
              ) : (
                <>
                  <label>Cantidad a aportar</label>
                  <input
                    type="number"
                    value={montoAportar}
                    onChange={(e) => setMontoAportar(e.target.value)}
                  />
                  <button onClick={manejarSuscripcion}>Suscribirme</button>
                </>
              )}
              <button className="cerrar-btn" onClick={cerrarModal}>Cerrar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
