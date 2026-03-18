import { updateUserLastLogin } from "../db/queries/authQueries";
import service from "../services/adminService";
import jwt from "jsonwebtoken";

const adminLogin = async (_req: any, res: any) => {
  try {
    const payload = {
      email: _req.body.email,
      password: _req.body.password,
    };

    const user: any = await service.adminLogin(payload);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    await updateUserLastLogin(user.user.id);
    return res.status(200).json({
      success: true,
      payload: user,
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const adminGate = async (_req: any, res: any, next: any) => {
  const { password } = _req.body;

  if (password !== process.env.ADMIN_GATE_PASSWORD) {
    return res.status(401).json({ message: "Wrong gate password" });
  }

  const gateToken = jwt.sign(
    { gate: "admin" },
    process.env.ADMIN_GATE_JWT_SECRET!,
    { expiresIn: "5m" }
  );

  res.json({ gateToken });
};

const createAdmin = async (_req: any, res: any, next: any) => {
  try {
    const payload = {
      first_name: _req.body.first_name,
      last_name: _req.body.last_name,
      email: _req.body.email,
      password: _req.body.password,
      phone: _req.body.phone,
      address: _req.body.address,
      role: _req.body.role,
      departmentId: _req.body.departmentId,
      positionId: _req.body.positionId,
    };
    const result = await service.createAdmin(payload);

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getUsers = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getUsers();

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getManagers = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getManagers();

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateUser = async (_req: any, res: any, next: any) => {
  const payload = {
    id: _req.body.id,
    first_name: _req.body.firstName,
    last_name: _req.body.lastName,
    email: _req.body.email,
    phone: _req.body.phone,
    address: _req.body.address,
    role: _req.body.role,
    departmentId: _req.body.departmentId,
  };

  try {
    const result = await service.updateUser(payload);

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateMyProfile = async (_req: any, res: any, next: any) => {
  const payload = {
    id: _req.body.id,
    firstName: _req.body.name,
    lastName: _req.body.surname,
    email: _req.body.email,
    phone: _req.body.phone,
    address: _req.body.address,
  };

  try {
    const result = await service.updateMyProfile(payload);

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteUser = async (_req: any, res: any, next: any) => {
  const payload = _req.params.id;

  try {
    const result = await service.deleteUser({ id: payload });

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getUsersStatistics = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getUsersStatistics();

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getActiveVerifiedNonAdminUsers = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getActiveVerifiedNonAdminUsers();

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateUserStatus = async (_req: any, res: any, next: any) => {
  const payload = {
    id: _req.params.id,
    isActive: _req.body.isActive,
  };

  try {
    const result = await service.updateUserStatus(payload);

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getWorkersCount = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getWorkersCount();

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getUsersByDepartmentId = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getUsersByDepartmentId(_req.params.id);

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getUsersProfile = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getUsersProfile(_req.params.id);

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const changePassword = async (_req: any, res: any, next: any) => {
  const payload = {
    id: _req.body.id,
    password: _req.body.password,
  };
console.log(payload)
  try {
    const result = await service.changePassword(payload);

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllContracts = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getAllContracts();

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllUsers = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getAllUsers();

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getDepartmentAttendancePercentage = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getDepartmentAttendancePercentage();

    res.status(200).json({
      success: true,
      payload: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export {
  adminLogin,
  adminGate,
  createAdmin,
  getUsers,
  getManagers,
  updateUser,
  deleteUser,
  updateMyProfile,
  getUsersStatistics,
  getActiveVerifiedNonAdminUsers,
  updateUserStatus,
  getWorkersCount,
  getUsersByDepartmentId,
  getUsersProfile,
  changePassword,
  getAllContracts,
  getAllUsers,
  getDepartmentAttendancePercentage,
};
