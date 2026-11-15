import { pool } from "../config/db.js";

const campos = ["vehiculo_id", "conductor_id", "fecha_salida", "fecha_llegada", "origen", "destino", "kilometros", "observaciones"];
const valores = (b) => campos.map((c) => (c === "observaciones" ? b[c] ?? null : b[c]));

const SELECT_VIAJES = `
  SELECT v.*, ve.patente, ve.marca, ve.modelo,
         CONCAT(c.nombre, ' ', c.apellido) AS conductor
  FROM viajes v
  JOIN vehiculos ve ON ve.id = v.vehiculo_id
  JOIN conductores c ON c.id = v.conductor_id`;

// Devuelve true si todo está bien; si no, responde el error y devuelve false
async function validarReferencias(b, res) {
  const [veh] = await pool.query("SELECT id FROM vehiculos WHERE id = ?", [b.vehiculo_id]);
  if (!veh.length) {
    res.status(404).json({ message: "Vehículo no encontrado" });
    return false;
  }
  const [con] = await pool.query(
    "SELECT fecha_vencimiento_licencia FROM conductores WHERE id = ?",
    [b.conductor_id]
  );
  if (!con.length) {
    res.status(404).json({ message: "Conductor no encontrado" });
    return false;
  }
  if (con[0].fecha_vencimiento_licencia < b.fecha_salida) {
    res.status(403).json({ message: "La licencia del conductor está vencida a la fecha de salida" });
    return false;
  }
  return true;
}

// Historial filtrable por vehículo y/o conductor + total de kilómetros
export const getAll = async (req, res) => {
  const where = [];
  const params = [];
  if (req.query.vehiculo_id) { where.push("v.vehiculo_id = ?"); params.push(req.query.vehiculo_id); }
  if (req.query.conductor_id) { where.push("v.conductor_id = ?"); params.push(req.query.conductor_id); }

  const [viajes] = await pool.query(
    `${SELECT_VIAJES} ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY v.fecha_salida DESC, v.id DESC`,
    params
  );
  const total_km = viajes.reduce((acc, v) => acc + Number(v.kilometros), 0);
  res.json({ total_km: Math.round(total_km * 100) / 100, viajes });
};

export const create = async (req, res) => {
  if (!(await validarReferencias(req.body, res))) return;
  const [result] = await pool.query(
    `INSERT INTO viajes (${campos.join(",")}) VALUES (${campos.map(() => "?").join(",")})`,
    valores(req.body)
  );
  const [rows] = await pool.query(`${SELECT_VIAJES} WHERE v.id = ?`, [result.insertId]);
  res.status(201).json(rows[0]);
};

export const update = async (req, res) => {
  const [exists] = await pool.query("SELECT id FROM viajes WHERE id = ?", [req.params.id]);
  if (!exists.length) return res.status(404).json({ message: "Viaje no encontrado" });
  if (!(await validarReferencias(req.body, res))) return;

  await pool.query(
    `UPDATE viajes SET ${campos.map((c) => `${c} = ?`).join(", ")} WHERE id = ?`,
    [...valores(req.body), req.params.id]
  );
  const [rows] = await pool.query(`${SELECT_VIAJES} WHERE v.id = ?`, [req.params.id]);
  res.json(rows[0]);
};

export const remove = async (req, res) => {
  const [result] = await pool.query("DELETE FROM viajes WHERE id = ?", [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: "Viaje no encontrado" });
  res.status(204).send();
};
