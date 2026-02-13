import bcrypt from "bcryptjs";
import {
  createDepartmentQuery,
  createPositionQuery,
  deleteDepartmentQuery,
  deletePositionQuery,
  getPositionsByDepartmentIdQuery,
  getDepartmentsQuery,
  getPositionsQuery,
  updateDepartmentQuery,
  updatePositionQuery,
  getWorkersCountQuery,
  getWorkersQuery,
  deleteWorkerQuery,
  updateWorkerQuery,
  getAbsentWorkersCountByDepartmentQuery,
  getAttendanceWorkersByDepartmentQuery,
  getIfaUserCheckedInQuery,
  getDepartmentAttendanceStatsByIdQuery,
  getDepartmentAttendanceByDateRangeQuery,
  getWorkersByDepartmentIdQuery,
  getContractsQuery,
  createContractQuery,
  updateContractStatusQuery,
  transferUserToDepartmentQuery,
  getWorkersByDepartmentQuery,
} from "../db/queries/managerQueries";
import { getUserByEmailQuery } from "../db/queries/adminQueries";
import { checkInAttendanceQuery, checkOutAttendanceQuery, createWorkerQuery } from "../db/queries/workerQueries";
import jwt from "jsonwebtoken";

const managerLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const user = await getUserByEmailQuery(email);

    if (!user) {
      return "Invalid Credentials !";
    }
    if (user.role === "admin") {
      return "Invalid Credentials !";
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return "Invalid Credentials !";
    }

    const tokenPayload = {
      email: email,
      id: user.id,
    };

    const token = jwt.sign(
      { ...tokenPayload },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10d",
      }
    );

    return {
      token: token,
      user: {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        departmentId: user.departmentId,
        positionsId: user.positionsId,
        departmentName: user.departmentName,
        positionsTitle: user.positionsTitle,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const workerRegister = async ({
  firstName,
  lastName,
  email,
  password,
  phone,
  address,
  departmentId,
  positionId,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  departmentId?: string;
  positionId?: string;
}) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let user = await getUserByEmailQuery(email);
    console.log(user);

    if (!user) {
      user = await createWorkerQuery(
        firstName,
        lastName,
        email,
        bcryptPassword,
        phone,
        address,
        departmentId,
        positionId
      );

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "10d",
        }
      );

      return {
        token,
        ...user,
      };
    } else {
      return "This user exists";
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createDepartment = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  try {
    const department = await createDepartmentQuery({ name, description });
    return {
      ...department,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getDepartments = async () => {
  try {
    const result = await getDepartmentsQuery();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateDepartment = async ({
  id,
  name,
  description,
}: {
  id: number;
  name: string;
  description: string;
}) => {
  try {
    const result = await updateDepartmentQuery(id, name, description);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteDepartment = async ({ id }: { id: number }) => {
  try {
    const result = await deleteDepartmentQuery(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createPosition = async ({
  title,
  description,
  departmentId,
}: {
  title: string;
  description: string;
  departmentId: string;
}) => {
  try {
    const department = await createPositionQuery({
      title,
      description,
      departmentId,
    });
    return {
      ...department,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getPositions = async () => {
  try {
    const result = await getPositionsQuery();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updatePosition = async ({
  id,
  title,
  description,
  departmentId,
}: {
  id: number;
  title: string;
  description: string;
  departmentId: string;
}) => {
  try {
    const result = await updatePositionQuery(
      id,
      title,
      description,
      departmentId
    );
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deletePosition = async ({ id }: { id: number }) => {
  try {
    const result = await deletePositionQuery(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPositionsByDepartmentId = async ({ id }: { id: number }) => {
  try {
    const result = await getPositionsByDepartmentIdQuery(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getWorkersCount = async () => {
  try {
    const result = await getWorkersCountQuery();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getWorkers = async () => {
  try {
    const result = await getWorkersQuery();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getWorkersByDepartment = async (departmentId: string) => {
  try {
    const result = await getWorkersByDepartmentQuery(departmentId);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteWorker = async ({ id }: { id: number }) => {
  try {
    const result = await deleteWorkerQuery(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateWorker = async ({
  id,
  first_name,
  last_name,
  email,
  phone,
  address,
  status,
  departmentId,
  positionsId,
}: {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: number;
  status: string;
  departmentId: string;
  positionsId: string;
}) => {
  try {
    const result = await updateWorkerQuery(
      id,
      first_name,
      last_name,
      email,
      phone,
      address,
      status,
      departmentId,
      positionsId
    );
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAttendanceWorkersByDepartment = async (id: string) => {
  try {
    const result = await getAttendanceWorkersByDepartmentQuery(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkInAttendance = async ({
  userId,
  checkIn,
}: {
  userId: string;
  checkIn: string;
}) => {
  try {
    const result = await checkInAttendanceQuery({userId, checkIn});
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkOutAttendance = async ({
  userId,
  checkOut,
}: {
  userId: string;
  checkOut: string;
}) => {
  try {
    const result = await checkOutAttendanceQuery({userId, checkOut});
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAbsentWorkersCountByDepartment = async (id: string) => {
  try {
    const result = await getAbsentWorkersCountByDepartmentQuery(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getIfaUserCheckedIn = async (id: string) => {
  try {
    const result = await getIfaUserCheckedInQuery(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDepartmentAttendanceStatsById = async (departmentId: string) => {
  try {
    const result = await getDepartmentAttendanceStatsByIdQuery(departmentId);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDepartmentAttendanceByDateRange = async ({
  departmentId,
  startDate,
  endDate,
}: {
  departmentId: string;
  startDate: string,
  endDate: string,
}) => {
  try {
    const result = await getDepartmentAttendanceByDateRangeQuery(departmentId, startDate, endDate);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getWorkersByDepartmentId = async (departmentId: string) => {
  try {
    const result = await getWorkersByDepartmentIdQuery(departmentId);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getContracts = async () => {
  try {
    const result = await getContractsQuery();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createContract = async ({
  userId,
  contractType,
  salaryAmount,
  startDate,
  endDate,
  status,
}: {
  userId: string;
  contractType: string;
  salaryAmount: number;
  startDate: string;
  endDate: string;
  status: string;
}) => {
  try {
    const contract = await createContractQuery({ userId, contractType, salaryAmount, startDate, endDate, status });

    return {
      ...contract,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateContractStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  try {
    const result = await updateContractStatusQuery(id, status);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const transferUserToDepartment = async ({
  id,
  departmentId,
}: {
  id: string;
  departmentId: string;
}) => {
  try {
    const result = await transferUserToDepartmentQuery(id, departmentId);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
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
  getWorkersByDepartmentId,
  getContracts,
  createContract,
  updateContractStatus,
  transferUserToDepartment,
  getWorkersByDepartment,
};
