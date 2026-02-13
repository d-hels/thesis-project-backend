import passport from "passport";
import { Roles } from "../lib/types";

interface AuthenticatedRequest extends Express.Request {
  user?: {
    id: number;
    email: string;
    roleId: Roles;
  };
}

const auth = (allowedRoles?: Roles[]) => {
  return (_req: AuthenticatedRequest, res: any, next: any) => {
    passport.authenticate(
      "jwt",
      { session: false, failWithError: true },
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

        // Check if user's role_id is in allowed roles
        if (allowedRoles && allowedRoles.length > 0) {
          if (!allowedRoles.includes(user.roleId)) {
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

export { auth, AuthenticatedRequest };
