import {
  getUserByEmailQuery,
  createAdminQuery,
  createManagerQuery,
  getUsersQuery,
  updateUserQuery,
  deleteUserQuery,
  updateMyProfileQuery,
  getUsersCountQuery,
  getActiveVerifiedNonAdminUsersQuery,
  updateUserStatusQuery,
  getWorkerCountQuery,
  getUsersByDepartmentIdQuery,
  getUsersProfileQuery,
  changePasswordQuery,
  getAllContractsQuery,
  getAllUsersQuery,
  getManagersQuery,
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
      role_id: user.roleId,
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
  positionId,
}: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: string;
  departmentId?: string;
  positionId?: string;

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
        departmentId,
        positionId,
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

const getManagers = async () => {
  try {
    const result = await getManagersQuery();
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
  role,
  departmentId,
}: {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: number;
  role: string;
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
      role,
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

const getActiveVerifiedNonAdminUsers = async () => {
  try {
    const result = await getActiveVerifiedNonAdminUsersQuery();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUserStatus = async ({
  id,
  isActive,
}: {
  id: number;
  isActive: boolean;
}) => {
  try {
    const result = await updateUserStatusQuery(
      id,
      isActive
    );
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getWorkersCount = async () => {
  try {
    const result = await getWorkerCountQuery();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUsersByDepartmentId = async (departmentId: string) => {
  try {
    const result = await getUsersByDepartmentIdQuery(departmentId);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUsersProfile = async (id: string) => {
  try {
    const result = await getUsersProfileQuery(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const changePassword = async ({
  id,
  password,
}: {
  id: number;
  password: string;
}) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    const result = await changePasswordQuery(
      id,
      bcryptPassword,
    );

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllContracts = async () => {
  try {
    const result = await getAllContractsQuery();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const result = await getAllUsersQuery();
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
  getManagers,
  updateUser,
  deleteUser,
  updateMyProfile,
  getUsersCount,
  getActiveVerifiedNonAdminUsers,
  updateUserStatus,
  getWorkersCount,
  getUsersByDepartmentId,
  getUsersProfile,
  changePassword,
  getAllContracts,
  getAllUsers,
};
