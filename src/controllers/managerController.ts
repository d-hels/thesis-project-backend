import { updateContractStatusQuery } from "../db/queries/managerQueries";
import pool from "../db/setup";
import { generateContractPDFBuffer } from "../lib/contractPdfs";
import { sendContractEmail } from "../mailSender/mailSender";
import service from "../services/managerService";

const managerLogin = async (_req: any, res: any, next: any) => {
  try {
    const payload = {
      email: _req.body.email,
      password: _req.body.password,
    };
    const result = await service.managerLogin(payload);

    if (result) {
      res.status(200).json({
        success: result === "Invalid Credentials !" ? false : true,
        payload: result,
      });
    }
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const workerRegister = async (_req: any, res: any, next: any) => {
  try {
    const payload = {
      firstName: _req.body.firstName,
      lastName: _req.body.lastName,
      email: _req.body.email,
      password: _req.body.password,
      phone: _req.body.phone,
      address: _req.body.address,
      departmentId: _req.body.departmentId,
      positionId: _req.body.positionId,
    };

    const result = await service.workerRegister(payload);

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

const createDepartment = async (_req: any, res: any, next: any) => {
  try {
    const payload = {
      name: _req.body.name,
      description: _req.body.description,
    };

    const result = await service.createDepartment(payload);

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

const getDepartments = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getDepartments();

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

const updateDepartment = async (_req: any, res: any, next: any) => {
  const payload = {
    id: _req.body.id,
    name: _req.body.name,
    description: _req.body.description,
  };

  try {
    const result = await service.updateDepartment(payload);

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

const deleteDepartment = async (_req: any, res: any, next: any) => {
  const payload = _req.params.id;

  try {
    const result = await service.deleteDepartment({ id: payload });

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

const createPosition = async (_req: any, res: any, next: any) => {
  try {
    const payload = {
      title: _req.body.title,
      description: _req.body.description,
      departmentId: _req.body.departmentId,
    };

    const result = await service.createPosition(payload);

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

const getPositions = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getPositions();

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

const updatePosition = async (_req: any, res: any, next: any) => {
  const payload = {
    id: _req.body.id,
    title: _req.body.title,
    description: _req.body.description,
    departmentId: _req.body.departmentId,
  };

  try {
    const result = await service.updatePosition(payload);

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

const deletePosition = async (_req: any, res: any, next: any) => {
  const payload = _req.params.id;

  try {
    const result = await service.deletePosition({ id: payload });

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

const getPositionsByDepartmentId = async (_req: any, res: any, next: any) => {
  const payload = { id: _req.params.id };

  try {
    const result = await service.getPositionsByDepartmentId(payload);

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

const getWorkers = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getWorkers();

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

const deleteWorker = async (_req: any, res: any, next: any) => {
  const payload = _req.params.id;

  try {
    const result = await service.deleteWorker({ id: payload });

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

const updateWorker = async (_req: any, res: any, next: any) => {
  const payload = {
    id: _req.body.id,
    first_name: _req.body.firstName,
    last_name: _req.body.lastName,
    email: _req.body.email,
    phone: _req.body.phone,
    address: _req.body.address,
    departmentId: _req.body.departmentId,
    positionsId: _req.body.positionsId,
  };

  try {
    const result = await service.updateWorker(payload);

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

const getAttendanceWorkersByDepartment = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getAttendanceWorkersByDepartment(_req.params.id);

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

const checkInAttendance = async (_req: any, res: any, next: any) => {
  const payload = {
    userId: _req.body.userId,
    checkIn: _req.body.checkIn,
  };

  try {
    const result = await service.checkInAttendance(payload);

    if (result.success === false && result.reason === 'ALREADY_CHECKED_IN') {
      return res.status(200).json({
        success: false,
        message: 'User has already checked in today',
      });
    }
  
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

const checkOutAttendance = async (_req: any, res: any, next: any) => {
  const payload = {
    userId: _req.body.userId,
    checkOut: _req.body.checkOut,
  };

  try {
    const result = await service.checkOutAttendance(payload);

    if (result.success === false && result.reason === 'ALREADY_CHECKED_OUT') {
      return res.status(200).json({
        success: false,
        message: 'User has already checked in today',
      });
    }

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

const getAbsentWorkersCountByDepartment = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getAbsentWorkersCountByDepartment(_req.params.id);

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

const getIfaUserCheckedIn = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getIfaUserCheckedIn(_req.params.id);

    if (result.success === false) {
      return res.status(200).json(result);
    }

    res.status(200).json(result);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getDepartmentAttendanceStatsById = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getDepartmentAttendanceStatsById(_req.params.id);

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

const getDepartmentAttendanceByDateRange = async (_req: any, res: any, next: any) => {
  try {
    const payload = {
      departmentId: _req.params.id,
      startDate: _req.query.startDate,
      endDate: _req.query.endDate,
    };
    console.log(payload)
    const result = await service.getDepartmentAttendanceByDateRange(payload);

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

const sendContractPdfToUser = async (_req: any, res: any) => {
  try {
    const id = _req.params.id;

    const { rows } = await pool.query(
      `
      SELECT 
        c.*,
        u.first_name || ' ' || u.last_name AS full_name,
        u.email
      FROM contracts c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = $1
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }

    const contract = rows[0];

    const pdfBuffer = await generateContractPDFBuffer(contract);

    await sendContractEmail(
      contract.email,
      pdfBuffer,
      contract.full_name
    );

    await updateContractStatusQuery(id, "sent");

    res.status(200).json({
      success: true,
    });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "PDF generation failed" });
  }
};

const getWorkersByDepartmentId = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getWorkersByDepartmentId( _req.params.id);
    console.log(_req.params.id, 'r')
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

const getContracts = async (_req: any, res: any, next: any) => {
  try {
    const result = await service.getContracts();

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

const createContract = async (_req: any, res: any, next: any) => {
  try {
    const payload = {
      userId: _req.body.userId,
      contractType: _req.body.contractType,
      salaryAmount: _req.body.salaryAmount,
      startDate: _req.body.startDate,
      endDate: _req.body.endDate,
      status: _req.body.status,
    };

    const result = await service.createContract(payload);

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


const updateContractStatus = async (_req: any, res: any, next: any) => {
  const payload = {
    id: _req.body.id,
    status: _req.body.status,
  };

  try {
    const result = await service.updateContractStatus(payload);

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

export {
  managerLogin,
  workerRegister,
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  createPosition,
  getPositions,
  updatePosition,
  deletePosition,
  getPositionsByDepartmentId,
  getWorkersCount,
  getWorkers,
  deleteWorker,
  updateWorker,
  getAttendanceWorkersByDepartment,
  checkInAttendance,
  checkOutAttendance,
  getAbsentWorkersCountByDepartment,
  getIfaUserCheckedIn,
  getDepartmentAttendanceStatsById,
  getDepartmentAttendanceByDateRange,
  sendContractPdfToUser,
  getWorkersByDepartmentId,
  getContracts,
  createContract,
  updateContractStatus,
};
