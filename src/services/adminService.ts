import {
  getUserByEmailQuery,
  createAdminQuery,
  createManagerQuery,
  getUsersQuery,
  updateUserQuery,
  deleteUserQuery,
  updateMyProfileQuery,
  getUsersCountQuery,
} from "../db/queries/adminQueries";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminLogin = async ({
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
    console.log(user, "useri");
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
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createAdmin = async ({
  first_name,
  last_name,
  email,
  password,
  phone,
  address,
  role,
  departmentId,
}: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: string;
  departmentId?: string;
}) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    if (role === "admin") {
      let admin = await createAdminQuery(
        first_name,
        last_name,
        email,
        bcryptPassword,
        phone,
        address
      );
      const token = jwt.sign(
        { id: admin.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "10d",
        }
      );

      return {
        token,
        ...admin,
      };
    } else if (role === "manager") {
      let manager = await createManagerQuery(
        first_name,
        last_name,
        email,
        bcryptPassword,
        phone,
        address,
        departmentId
      );
      const token = jwt.sign(
        { id: manager.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "10d",
        }
      );

      return {
        token,
        ...manager,
      };
    } else {
      const noRole = "No Role Provided!";
      return {
        noRole,
      };
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const getUsers = async () => {
  try {
    const result = await getUsersQuery();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUser = async ({
  id,
  first_name,
  last_name,
  email,
  phone,
  address,
  departmentId,
}: {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: number;
  departmentId: string;
}) => {
  try {
    const result = await updateUserQuery(
      id,
      first_name,
      last_name,
      email,
      phone,
      address,
      departmentId
    );
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateMyProfile = async ({
  id,
  firstName,
  lastName,
  email,
  phone,
  address,
}: {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: number;
}) => {
  try {
    const result = await updateMyProfileQuery(
      id,
      firstName,
      lastName,
      email,
      phone,
      address
    );
    console.log(result, "res");
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteUser = async ({ id }: { id: number }) => {
  try {
    const result = await deleteUserQuery(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUsersCount = async () => {
  try {
    const result = await getUsersCountQuery();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  adminLogin,
  createAdmin,
  getUsers,
  updateUser,
  deleteUser,
  updateMyProfile,
  getUsersCount,
};
