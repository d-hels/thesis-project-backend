import passport from "passport";
import { Roles } from "../lib/types";

const auth = (roles?: Roles[]) => {
  return (_req: any, res: any, next: any) => {
    passport.authenticate(
      "jwt",
      { failWithError: true },
      (err: any, user: any, info: any) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: err.message,
          });
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: info?.message || "Unauthorized",
          });
        }

        if (roles && roles.length > 0) {
          if (!roles.includes(user.role)) {
            return res.status(403).json({
              success: false,
              message: "You don't have permission to access this route",
            });
          }
        }

        _req.user = user;
        next();
      }
    )(_req, res, next);
  };
};

export { auth };
