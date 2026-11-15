import { Router } from "express";
import { crud } from "../controllers/crud.js";
import { idParam, vehiculoRules } from "../validators/validators.js";
import { validate } from "../middlewares/validate.js";

const c = crud("vehiculos", ["marca", "modelo", "patente", "anio", "capacidad_carga"]);
const router = Router();

router.get("/", c.getAll);
router.get("/:id", idParam, validate, c.getOne);
router.post("/", vehiculoRules, validate, c.create);
router.put("/:id", idParam, vehiculoRules, validate, c.update);
router.delete("/:id", idParam, validate, c.remove);

export default router;
