import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const register = async (req, res) => {
  const { nombre, email, password } = req.body;
  const [exists] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [email]);
  if (exists.length) return res.status(400).json({ message: "El email ya está registrado" });

  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
    [nombre, email, hash]
  );
  res.status(201).json({ id: result.insertId, nombre, email });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "4h" });
  res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } });
};
