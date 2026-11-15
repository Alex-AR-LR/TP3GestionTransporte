import { pool } from "../config/db.js";

// Controlador CRUD genérico para vehiculos y conductores
export const crud = (table, fields) => {
  const findById = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return rows[0];
  };
  const values = (body) => fields.map((f) => body[f]);

  return {
    getAll: async (req, res) => {
      const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY id DESC`);
      res.json(rows);
    },

    getOne: async (req, res) => {
      const row = await findById(req.params.id);
      if (!row) return res.status(404).json({ message: "No encontrado" });
      res.json(row);
    },

    create: async (req, res) => {
      const [result] = await pool.query(
        `INSERT INTO ${table} (${fields.join(",")}) VALUES (${fields.map(() => "?").join(",")})`,
        values(req.body)
      );
      res.status(201).json(await findById(result.insertId));
    },

    update: async (req, res) => {
      if (!(await findById(req.params.id)))
        return res.status(404).json({ message: "No encontrado" });
      await pool.query(
        `UPDATE ${table} SET ${fields.map((f) => `${f} = ?`).join(", ")} WHERE id = ?`,
        [...values(req.body), req.params.id]
      );
      res.json(await findById(req.params.id));
    },

    remove: async (req, res) => {
      if (!(await findById(req.params.id)))
        return res.status(404).json({ message: "No encontrado" });
      await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
      res.status(204).send();
    },
  };
};
