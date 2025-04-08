
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login  ({setIsAuthenticated})  {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;
  
    const onSubmit = async (data) => {
      try {
        const res = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
  
        if (!res.ok) {
          throw new Error("Credenciales inválidas");
        }
  
        const result = await res.json();
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      } catch (err) {
        alert(err.message);
      }
    };
  
    return (
        <div className="login-container">
          <div className="login-card">
            <div className="login-left">
              <h1>Bienvenido</h1>
              <p>Accede a tu cuenta para continuar</p>
            </div>
            <div className="login-right">
              <h2>Iniciar Sesión</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-container icon-input">
                  <span className="icon">👤</span>
                  <input
                    type="email"
                    placeholder="Correo"
                    {...register("email", { required: "Campo obligatorio" })}
                  />
                </div>
                {errors.email && <p className="error">{errors.email.message}</p>}
      
                <div className="input-container icon-input">
                  <span className="icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    {...register("password", { required: "Campo obligatorio" })}
                  />
                </div>
                {errors.password && <p className="error">{errors.password.message}</p>}
      
                <button type="submit" className="btn-login">Entrar</button>
              </form>
              <p className="register-link">
                ¿No tienes cuenta?{" "}
                <span className="register-btn" onClick={() => navigate("/")}>
                  Regístrate
                </span>
              </p>
            </div>
          </div>
        </div>
      );
      
};


