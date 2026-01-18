enum Roles {
  ADMIN = "admin",
  MANAGER = "manager",
  WORKER = "worker",
}

interface JwtPayload {
  id: number;
}

export { Roles, JwtPayload };
