enum Roles {
  ADMIN = 1,
  MANAGER = 2,
  WORKER = 3,
}

interface JwtPayload {
  id: number;
}

export { Roles, JwtPayload };
