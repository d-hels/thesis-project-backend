import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function adminGateGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "Admin gate required",
    });
  }

  try {
    jwt.verify(token, process.env.ADMIN_GATE_JWT_SECRET!);
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Admin gate expired or invalid",
    });
  }
}
