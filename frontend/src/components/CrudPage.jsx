import { useEffect, useState } from "react";
import { api } from "../api.js";

// Página genérica: listado + formulario de alta/modificación + baja
export default function CrudPage({ title, endpoint, fields, validate }) {
  const empty = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  const load = () => api(endpoint).then(setItems).catch((e) => setMsg(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setForm(empty);
    setEditId(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const errs = {};
    fields.forEach((f) => {
      if (String(form[f.name]).trim() === "") errs[f.name] = "Campo obligatorio";
    });
    Object.assign(errs, Object.keys(errs).length ? {} : validate(form));
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      if (editId) await api(`${endpoint}/${editId}`, { method: "PUT", body: form });
      else await api(endpoint, { method: "POST", body: form });
      reset();
      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm(Object.fromEntries(fields.map((f) => [f.name, item[f.name]])));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar registro?")) return;
    try {
      await api(`${endpoint}/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <section>
      <h1>{title}</h1>
      {msg && <p className="error-box">{msg}</p>}

      <form onSubmit={handleSubmit} className="card form-grid" noValidate>
        {fields.map((f) => (
          <label key={f.name}>
            {f.label}
            <input
              name={f.name}
              type={f.type || "text"}
              step={f.type === "number" ? "any" : undefined}
              value={form[f.name]}
              onChange={handleChange}
            />
            {errors[f.name] && <span className="field-error">{errors[f.name]}</span>}
          </label>
        ))}
        <div className="actions">
          <button type="submit">{editId ? "Guardar cambios" : "Agregar"}</button>
          {editId && (
            <button type="button" className="secondary" onClick={reset}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {fields.map((f) => (
                <th key={f.name}>{f.label}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {fields.map((f) => (
                  <td key={f.name}>{item[f.name]}</td>
                ))}
                <td className="row-actions">
                  <button onClick={() => handleEdit(item)}>Editar</button>
                  <button className="danger" onClick={() => handleDelete(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={fields.length + 1}>Sin registros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
