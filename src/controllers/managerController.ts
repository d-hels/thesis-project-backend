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
};
