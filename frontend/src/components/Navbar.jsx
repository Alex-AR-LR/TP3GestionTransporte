import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth.jsx";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">Transporte</NavLink>
      <div className="links">
        {token ? (
          <>
            <NavLink to="/vehiculos">Vehículos</NavLink>
            <NavLink to="/conductores">Conductores</NavLink>
            <NavLink to="/viajes">Viajes</NavLink>
            <span className="user">{user?.nombre}</span>
            <button onClick={handleLogout}>Salir</button>
          </>
        ) : (
          <NavLink to="/login">Iniciar sesión</NavLink>
        )}
      </div>
    </nav>
  );
}
