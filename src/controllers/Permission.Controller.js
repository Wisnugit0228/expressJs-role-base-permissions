import PermissionService from "../services/Permision.service.js";

export const postPermissionController = async (req, res) => {
    try {
        const { module, action, description } = req.body;
        const newPermission = await new PermissionService().createPermission({ module, action, description });
        res.status(201).json({
            status: 'success',
        });
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const getPermissionsController = async (req, res) => {
    try {
        const permissions = await new PermissionService().getPermissions();
        res.status(200).json({
            status: 'success',
            data: permissions
        });
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const editPermissionByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const { module, action, description } = req.body;
        await new PermissionService().editPermissionById(id, { module, action, description });
        res.status(200).json({
            status: 'success',
            message: 'Permission updated successfully'
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const deletePermissionByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        await new PermissionService().deletePermissionById(id);
        res.status(200).json({
            status: 'success',
            message: 'Permission deleted successfully'
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}