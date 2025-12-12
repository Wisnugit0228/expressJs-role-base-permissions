import RolePermissionService from "../services/RolePermission.service.js";

export const postRolePermissionController = async (req, res) => {
    try {
        const { role_id, permission_id } = req.body;
        const newRolePermission = await new RolePermissionService().createRolePermission({ role_id, permission_id });
        res.status(201).json({
            status: 'success',
            data: newRolePermission
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const deleteRolePermissionByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        await new RolePermissionService().deleteRolePermissionById(id);
        res.status(200).json({
            status: 'success',
            message: 'Role permission deleted successfully'
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}