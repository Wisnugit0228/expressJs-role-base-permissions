import SuperAdminService from "../services/SuperAdmin.service.js";

export const addUserController = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const newUser = await new SuperAdminService().createUser({ email, password, role });
        res.status(201).json({
            status: 'success',
            data: newUser
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}