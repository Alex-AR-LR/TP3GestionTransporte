import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Login() {
  const [registro, setRegistro] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const errs = {};
    if (registro && !form.nombre.trim()) errs.nombre = "Campo obligatorio";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Email inválido";
    if (form.password.length < 6) errs.password = "Mínimo 6 caracteres";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      if (registro) await api("/auth/register", { method: "POST", body: form });
      const data = await api("/auth/login", {
        method: "POST",
        body: { email: form.email, password: form.password },
      });
      login(data.token, data.user);
      navigate("/vehiculos");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <section className="auth">
      <h1>{registro ? "Crear cuenta" : "Iniciar sesión"}</h1>
      {msg && <p className="error-box">{msg}</p>}

      <form onSubmit={handleSubmit} className="card" noValidate>
        {registro && (
          <label>
            Nombre
            <input name="nombre" value={form.nombre} onChange={handleChange} />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </label>
        )}
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>
        <button type="submit">{registro ? "Registrarme" : "Entrar"}</button>
      </form>

      <p>
        {registro ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
        <button className="link" onClick={() => setRegistro(!registro)}>
          {registro ? "Iniciar sesión" : "Registrate"}
        </button>
      </p>
    </section>
  );
}
