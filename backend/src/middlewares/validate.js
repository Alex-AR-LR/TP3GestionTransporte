import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  res.status(400).json({
    message: "Datos inválidos",
    errors: result.array().map((e) => ({ field: e.path, message: e.msg })),
  });
};
