import bcrypt from 'bcryptjs'
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
} from "../db/queries/managerQueries";
import { getUserByEmailQuery } from "../db/queries/adminQueries";
import { createWorkerQuery } from "../db/queries/workerQueries";
import jwt from 'jsonwebtoken'

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
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  address: string
  departmentId?: string
  positionId?: string
}) => {
  try {
      const salt = await bcrypt.genSalt(10)
      const bcryptPassword = await bcrypt.hash(password, salt)

      let user = await getUserByEmailQuery(email)
      console.log(user)

      if(!user){
          user = await createWorkerQuery(
              firstName,
              lastName,
              email,
              bcryptPassword,
              phone,
              address,
              departmentId,
              positionId,
          )

          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
              expiresIn: '10d',
          })
      
          return {
              token,
              ...user,
          }
      }
      else {
          return 'This user exists'
      }
  } catch (err) {
      console.error(err)
      throw err
  }
}

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

const deleteWorker = async ({ id }: { id: number }) => {
  try {
    const result = await deleteWorkerQuery(id)
    return result
  } catch (error) {
    console.log(error)
    throw error
  }
}

const updateWorker = async ({
  id,
  first_name,
  last_name,
  email,
  phone,
  address,
  departmentId,
  positionsId,
}: {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: number
  departmentId: string
  positionsId: string
}) => {
  try {
    const result = await updateWorkerQuery(
      id,
      first_name,
      last_name,
      email,
      phone,
      address,
      departmentId,
      positionsId,
    )
    return result
  } catch (error) {
    console.log(error)
    throw error
  }
}
export default {
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
};
