import { Link } from "react-router";
import { useAuth } from "../auth.jsx";

export default function Home() {
  const { token } = useAuth();

  return (
    <section className="hero">
      <h1>Gestión de Transporte</h1>
      <p>
        Registrá los vehículos de tu empresa, sus conductores y los viajes realizados, y
        consultá el historial y los kilómetros recorridos.
      </p>
      {token ? (
        <Link className="btn" to="/viajes">Ir a la aplicación</Link>
      ) : (
        <Link className="btn" to="/login">Iniciar sesión</Link>
      )}
    </section>
  );
}
