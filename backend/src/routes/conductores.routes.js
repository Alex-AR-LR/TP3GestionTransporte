import { Router } from "express";
import { crud } from "../controllers/crud.js";
import { idParam, conductorRules } from "../validators/validators.js";
import { validate } from "../middlewares/validate.js";

const c = crud("conductores", [
  "nombre",
  "apellido",
  "numero_documento",
  "numero_licencia",
  "fecha_alta_licencia",
  "fecha_vencimiento_licencia",
]);
const router = Router();

router.get("/", c.getAll);
router.get("/:id", idParam, validate, c.getOne);
router.post("/", conductorRules, validate, c.create);
router.put("/:id", idParam, conductorRules, validate, c.update);
router.delete("/:id", idParam, validate, c.remove);

export default router;
