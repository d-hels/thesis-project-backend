import service from '../services/adminService'
import jwt from "jsonwebtoken";

const adminLogin = async (_req: any, res: any, next: any) => {
    try {
      const payload = {
        email: _req.body.email,
        password: _req.body.password,
      }
      const result = await service.adminLogin(payload)
      console.log(result)
  
      if (result) {
        res.status(200).json({
          success: result === 'Invalid Credentials !' ? false : true,
          payload: result,
        })
      }
    } catch (err: any) {
      console.log(err.message)
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      })
    }
}

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
      }
      const result = await service.createAdmin(payload)
      console.log(payload)
  
      res.status(200).json({
        success: true,
        payload: result,
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      })
    }
}
const getUsers = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getUsers()

    res.status(200).json({
      success: true,
      payload: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    })
  }
}

const updateUser = async (_req: any, res: any, next: any) => {
  const payload = {
    id: _req.body.id,
    first_name: _req.body.firstName,
    last_name: _req.body.lastName,
    email: _req.body.email,
    phone: _req.body.phone,
    address: _req.body.address,
    departmentId: _req.body.departmentId,
  }
  console.log(payload)

  try {
    const result = await service.updateUser(payload)

    res.status(200).json({
      success: true,
      payload: result,
    })
  } catch (err: any) {
    console.log(err.message)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    })
  }
}

const updateMyProfile = async (_req: any, res: any, next: any) => {
  const payload = {
    id: _req.body.id,
    firstName: _req.body.name,
    lastName: _req.body.surname,
    email: _req.body.email,
    phone: _req.body.phone,
    address: _req.body.address,
  }
  console.log(payload)

  try {
    const result = await service.updateMyProfile(payload)

    res.status(200).json({
      success: true,
      payload: result,
    })
  } catch (err: any) {
    console.log(err.message)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    })
  }
}

const deleteUser = async (_req: any, res: any, next: any) => {
  const payload = _req.params.id

  try {
    const result = await service.deleteUser({ id: payload })

    res.status(200).json({
      success: true,
      payload: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    })
  }
}

const getUsersCount = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getUsersCount()

    res.status(200).json({
      success: true,
      payload: result,
    })
  } catch (err: any) {
    console.log(err.message)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    })
  }
}

export {
  adminLogin,
  adminGate,
  createAdmin,
  getUsers,
  updateUser,
  deleteUser,
  updateMyProfile,
  getUsersCount,
}
