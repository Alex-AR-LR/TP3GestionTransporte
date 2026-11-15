import { Router } from "express";
import * as c from "../controllers/viajes.controller.js";
import { idParam, viajeRules, viajeFiltroRules } from "../validators/validators.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.get("/", viajeFiltroRules, validate, c.getAll);
router.post("/", viajeRules, validate, c.create);
router.put("/:id", idParam, viajeRules, validate, c.update);
router.delete("/:id", idParam, validate, c.remove);

export default router;
