import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./auth.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Vehiculos from "./pages/Vehiculos.jsx";
import Conductores from "./pages/Conductores.jsx";
import Viajes from "./pages/Viajes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/vehiculos" element={<Vehiculos />} />
              <Route path="/conductores" element={<Conductores />} />
              <Route path="/viajes" element={<Viajes />} />
            </Route>
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
