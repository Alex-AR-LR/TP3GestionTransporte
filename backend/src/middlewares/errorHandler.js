export const notFound = (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
};

export const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON inválido" });
  }
  if (err.code === "ER_DUP_ENTRY") {
    return res
      .status(400)
      .json({ message: "Ya existe un registro con ese dato único (email, patente, documento o licencia)" });
  }
  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    return res
      .status(400)
      .json({ message: "No se puede eliminar: tiene viajes asociados" });
  }
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
};
