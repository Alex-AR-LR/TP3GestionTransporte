import { body, param, query } from "express-validator";

const fecha = (campo, nombre) =>
  body(campo)
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage(`${nombre} debe tener formato YYYY-MM-DD`);

export const idParam = param("id").isInt({ min: 1 }).withMessage("id inválido");

export const registerRules = [
  body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("email").trim().isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const loginRules = [
  body("email").trim().isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

export const vehiculoRules = [
  body("marca").trim().notEmpty().withMessage("La marca es obligatoria"),
  body("modelo").trim().notEmpty().withMessage("El modelo es obligatorio"),
  body("patente")
    .trim()
    .toUpperCase()
    .notEmpty()
    .withMessage("La patente es obligatoria"),
  body("anio")
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage("Año inválido"),
  body("capacidad_carga")
    .isFloat({ gt: 0 })
    .withMessage("La capacidad de carga debe ser mayor a 0"),
];

export const conductorRules = [
  body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").trim().notEmpty().withMessage("El apellido es obligatorio"),
  body("numero_documento")
    .trim()
    .notEmpty()
    .withMessage("El número de documento es obligatorio"),
  body("numero_licencia")
    .trim()
    .notEmpty()
    .withMessage("El número de licencia es obligatorio"),
  fecha("fecha_alta_licencia", "La fecha de alta"),
  fecha("fecha_vencimiento_licencia", "La fecha de vencimiento").custom(
    (v, { req }) => v > req.body.fecha_alta_licencia
  ).withMessage("El vencimiento debe ser posterior al alta"),
];

export const viajeRules = [
  body("vehiculo_id").isInt({ min: 1 }).withMessage("vehiculo_id inválido"),
  body("conductor_id").isInt({ min: 1 }).withMessage("conductor_id inválido"),
  fecha("fecha_salida", "La fecha de salida"),
  fecha("fecha_llegada", "La fecha de llegada").custom(
    (v, { req }) => v >= req.body.fecha_salida
  ).withMessage("La llegada no puede ser anterior a la salida"),
  body("origen").trim().notEmpty().withMessage("El origen es obligatorio"),
  body("destino").trim().notEmpty().withMessage("El destino es obligatorio"),
  body("kilometros").isFloat({ gt: 0 }).withMessage("Los kilómetros deben ser mayores a 0"),
  body("observaciones").optional({ values: "null" }).isString().withMessage("Observaciones inválidas"),
];

export const viajeFiltroRules = [
  query("vehiculo_id").optional().isInt({ min: 1 }).withMessage("vehiculo_id inválido"),
  query("conductor_id").optional().isInt({ min: 1 }).withMessage("conductor_id inválido"),
];
