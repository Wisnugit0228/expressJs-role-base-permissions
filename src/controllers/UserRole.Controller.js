import UserRoleService from "../services/UserRole.service.js";

export const postUserRoleController = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        const newRole = await new UserRoleService().addUserRole({ userId, roleId });
        res.status(201).json({
            status: 'success',
            data: newRole
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'error',
            message: error.message
        })
    }
}