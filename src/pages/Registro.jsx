// src/pages/Registro.jsx
import RegistroUsuario from "../components/RegistroUsuario";
import "../components/RegistroUsuario.css"

export default function Registro({ setIsAuthenticated }) {
  return (
    <div className="registro-container">
      <div className="registro-left">
      </div>

      <div className="registro-right">
        <RegistroUsuario setIsAuthenticated={setIsAuthenticated} />
      </div>
    </div>
  );
}
