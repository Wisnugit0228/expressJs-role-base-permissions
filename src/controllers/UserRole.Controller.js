import UserRoleService from "../services/UserRole.service.js";

export const postUserRoleController = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        const newRole = await new UserRoleService().addUserRole({ userId, roleId });
        res.status(201).json({
            status: 'success'
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'error',
            message: error.message
        })
    }
}

export const editUserRoleController = async (req, res) => {
    try {
        const {id} = req.params;
        const {roleId} = req.body;
        await new UserRoleService().editUserRoleById(id, roleId);
        res.status(200).json({
            status: 'success'
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'error',
            message: error.message
        })
    }
}