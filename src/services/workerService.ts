import bcrypt from "bcryptjs";
import { getUserByEmailQuery } from "../db/queries/adminQueries";
import { checkInAttendanceQuery, checkOutAttendanceQuery, createWorkerQuery } from "../db/queries/workerQueries";
import jwt from "jsonwebtoken";
const expiresIn = process.env.JWT_EXPIRES_IN;

if (!process.env.JWT_SECRET || !expiresIn) {
  throw new Error("JWT env variables are not defined");
}

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

export default {
  workerRegister,
  checkInAttendance,
  checkOutAttendance,
};
