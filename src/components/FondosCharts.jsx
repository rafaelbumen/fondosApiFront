import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer
} from "recharts";
import "./FondosCharts.css";

const COLORS = ["#3182CE", "#38A169", "#D69E2E", "#E53E3E", "#805AD5"];

const FondosCharts = () => {
  const [fondos, setFondos] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFondos = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/fondos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Error al obtener fondos");
        return;
      }

      const data = await res.json();
      setFondos(data);
    };

    fetchFondos();
  }, []);

  const totalPorCategoria = fondos.reduce((acc, fondo) => {
    acc[fondo.categoria] = (acc[fondo.categoria] || 0) + fondo.totalAportes;
    return acc;
  }, {});

  const pieData = Object.entries(totalPorCategoria).map(([categoria, valor]) => ({
    name: categoria,
    value: valor,
  }));

  return (
    <div className="charts-wrapper">
      <div className="chart-box">
        <h3>Total de Aportes por Fondo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fondos} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" hide /> {/* Ocultamos nombres para no saturar */}
            <YAxis hide />
            <Tooltip
              formatter={(value) => `$${value.toLocaleString("es-CO")}`}
              labelFormatter={(label, payload) => {
                const fondo = fondos.find(f => f.nombre === label);
                return fondo ? fondo.nombre : label;
              }}
            />
            <Bar dataKey="totalAportes">
              {fondos.map((_, index) => (
                <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <h3>Distribución por Categoría</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString("es-CO")}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FondosCharts;
