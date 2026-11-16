import { useEffect, useState } from "react";
import { api } from "../api.js";

const empty = {
  vehiculo_id: "",
  conductor_id: "",
  fecha_salida: "",
  fecha_llegada: "",
  origen: "",
  destino: "",
  kilometros: "",
  observaciones: "",
};

export default function Viajes() {
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [viajes, setViajes] = useState([]);
  const [totalKm, setTotalKm] = useState(0);
  const [filtro, setFiltro] = useState({ vehiculo_id: "", conductor_id: "" });
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  const loadViajes = () => {
    const params = new URLSearchParams();
    if (filtro.vehiculo_id) params.set("vehiculo_id", filtro.vehiculo_id);
    if (filtro.conductor_id) params.set("conductor_id", filtro.conductor_id);
    api(`/viajes?${params}`)
      .then((d) => {
        setViajes(d.viajes);
        setTotalKm(d.total_km);
      })
      .catch((e) => setMsg(e.message));
  };

  useEffect(() => {
    Promise.all([api("/vehiculos"), api("/conductores")])
      .then(([v, c]) => {
        setVehiculos(v);
        setConductores(c);
      })
      .catch((e) => setMsg(e.message));
  }, []);

  useEffect(loadViajes, [filtro]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const errs = {};
    ["vehiculo_id", "conductor_id", "fecha_salida", "fecha_llegada", "origen", "destino", "kilometros"].forEach(
      (c) => {
        if (String(form[c]).trim() === "") errs[c] = "Campo obligatorio";
      }
    );
    if (!errs.fecha_llegada && !errs.fecha_salida && form.fecha_llegada < form.fecha_salida)
      errs.fecha_llegada = "No puede ser anterior a la salida";
    if (!errs.kilometros && !(Number(form.kilometros) > 0)) errs.kilometros = "Debe ser mayor a 0";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      await api("/viajes", { method: "POST", body: form });
      setForm(empty);
      loadViajes();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar viaje?")) return;
    try {
      await api(`/viajes/${id}`, { method: "DELETE" });
      loadViajes();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const error = (name) => errors[name] && <span className="field-error">{errors[name]}</span>;

  return (
    <section>
      <h1>Viajes</h1>
      {msg && <p className="error-box">{msg}</p>}

      <form onSubmit={handleSubmit} className="card form-grid" noValidate>
        <label>
          Vehículo
          <select name="vehiculo_id" value={form.vehiculo_id} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.patente} - {v.marca} {v.modelo}
              </option>
            ))}
          </select>
          {error("vehiculo_id")}
        </label>
        <label>
          Conductor
          <select name="conductor_id" value={form.conductor_id} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            {conductores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.apellido}, {c.nombre}
              </option>
            ))}
          </select>
          {error("conductor_id")}
        </label>
        <label>
          Fecha de salida
          <input type="date" name="fecha_salida" value={form.fecha_salida} onChange={handleChange} />
          {error("fecha_salida")}
        </label>
        <label>
          Fecha de llegada
          <input type="date" name="fecha_llegada" value={form.fecha_llegada} onChange={handleChange} />
          {error("fecha_llegada")}
        </label>
        <label>
          Origen
          <input name="origen" value={form.origen} onChange={handleChange} />
          {error("origen")}
        </label>
        <label>
          Destino
          <input name="destino" value={form.destino} onChange={handleChange} />
          {error("destino")}
        </label>
        <label>
          Kilómetros
          <input type="number" step="any" name="kilometros" value={form.kilometros} onChange={handleChange} />
          {error("kilometros")}
        </label>
        <label>
          Observaciones
          <input name="observaciones" value={form.observaciones} onChange={handleChange} />
        </label>
        <div className="actions">
          <button type="submit">Registrar viaje</button>
        </div>
      </form>

      <div className="card filters">
        <label>
          Filtrar por vehículo
          <select value={filtro.vehiculo_id} onChange={(e) => setFiltro({ ...filtro, vehiculo_id: e.target.value })}>
            <option value="">Todos</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.patente}
              </option>
            ))}
          </select>
        </label>
        <label>
          Filtrar por conductor
          <select value={filtro.conductor_id} onChange={(e) => setFiltro({ ...filtro, conductor_id: e.target.value })}>
            <option value="">Todos</option>
            {conductores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.apellido}, {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <p className="total">
          Total recorrido: <strong>{totalKm} km</strong>
        </p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Vehículo</th>
              <th>Conductor</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Km</th>
              <th>Observaciones</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {viajes.map((v) => (
              <tr key={v.id}>
                <td>{v.fecha_salida}</td>
                <td>{v.fecha_llegada}</td>
                <td>{v.patente}</td>
                <td>{v.conductor}</td>
                <td>{v.origen}</td>
                <td>{v.destino}</td>
                <td>{v.kilometros}</td>
                <td>{v.observaciones}</td>
                <td className="row-actions">
                  <button className="danger" onClick={() => handleDelete(v.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!viajes.length && (
              <tr>
                <td colSpan="9">Sin viajes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
