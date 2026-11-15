import passport from "../config/passport.js";

// Middleware de Passport: verifica el JWT y protege las rutas
export const requireAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      const message =
        info?.name === "TokenExpiredError" ? "Token expirado" : "No autenticado";
      return res.status(401).json({ message });
    }
    req.user = user;
    next();
  })(req, res, next);
};
