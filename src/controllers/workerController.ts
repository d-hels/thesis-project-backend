import service from "../services/workerService";

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

export { workerRegister };
