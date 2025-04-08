import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./RegistroUsuario.css";
import step1 from "../assets/step.png";  // Solo una imagen
import { useNavigate } from "react-router-dom"

const schema = yup.object().shape({
    password: yup.string()
        .required("La contraseña es obligatoria")
        .min(6, "Mínimo 6 caracteres"),
    confirmPassword: yup.string()
        .oneOf([yup.ref("password"), null], "Las contraseñas no coinciden")
        .required("Debes confirmar la contraseña"),
    nombre: yup.string().required("El nombre es obligatorio").matches(/^[a-zA-Z\s]+$/, "Solo letras y espacios"),
    apellidos: yup.string().required("Los apellidos son obligatorios").matches(/^[a-zA-Z\s]+$/, "Solo letras y espacios"),
    email: yup.string().required("El email es obligatorio").email("Email inválido"),
    telefono: yup.string().required("El teléfono es obligatorio").matches(/^\+?[0-9\s]+$/, "Teléfono inválido"),
    notificationMethod: yup.string().oneOf(["email", "sms"], "Método no válido").required("Método requerido"),
});

export default function RegistroUsuario({ setIsAuthenticated }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const API = import.meta.env.VITE_API_URL;

    console.log(API);
    

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${API}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                alert("Errores: " + JSON.stringify(errorData));
                return;
            }
    
            // 🔐 Intentar loguear automáticamente al usuario
            const loginRes = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });
    
            if (loginRes.ok) {
                const loginData = await loginRes.json();
                console.log("Login response:", loginData);
    
                localStorage.setItem("token", loginData.token);
                setIsAuthenticated(true); // <- 🔑 actualiza el estado global
    
                alert("✅ Usuario registrado y logueado correctamente");
                reset();
                navigate("/dashboard");
            } else {
                const errorText = await loginRes.text();
                console.error("❌ Falló el login:", errorText);
                alert("⚠ Usuario registrado, pero no fue posible iniciar sesión automáticamente.");
                navigate("/login");
            }
    
        } catch (err) {
            alert("❌ Error al registrar el usuario");
            console.error(err);
        }
    };
    


    return (
        <div className="main-wrapper">
            <div className="form-container">
                {/* LADO IZQUIERDO */}
                <div className="form-left">
                    <div className="step">
                        <img src={step1} alt="Paso 1" />
                        <div>
                            <p><strong>1.</strong> Llena el formulario con tus datos.</p>
                            <p><strong>2.</strong> Selecciona tu método de notificación.</p>
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO */}
                <div className="form-right">
                    <h2>Registro de Usuario</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>Nombre</label>
                            <input type="text" {...register("nombre")} />
                            {errors.nombre && <p className="error">{errors.nombre.message}</p>}
                        </div>

                        <div>
                            <label>Apellidos</label>
                            <input type="text" {...register("apellidos")} />
                            {errors.apellidos && <p className="error">{errors.apellidos.message}</p>}
                        </div>

                        <div>
                            <label>Email</label>
                            <input type="email" {...register("email")} />
                            {errors.email && <p className="error">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label>Teléfono</label>
                            <input type="text" {...register("telefono")} />
                            {errors.telefono && <p className="error">{errors.telefono.message}</p>}
                        </div>

                        <div className="full-width">
                            <label>Método de notificación</label>
                            <select {...register("notificationMethod")}>
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                            </select>
                            {errors.notificationMethod && <p className="error">{errors.notificationMethod.message}</p>}
                        </div>

                        <div>
                            <label>Contraseña</label>
                            <input type="password" {...register("password")} />
                            {errors.password && <p className="error">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label>Confirmar contraseña</label>
                            <input type="password" {...register("confirmPassword")} />
                            {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
                        </div>

                        <button type="submit" className="btn-submit">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

