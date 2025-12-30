import RoleService from "../services/Role.Service.js";
import { roleValidator } from "../validators/roles/index.js"

export const postRoleController = async (req, res) => {
    try {
        roleValidator.roleInputValidator(req.body);
        const { name, description } = req.body;
        const newRole = await new RoleService().createRole({ name, description });
        res.status(201).json({
            status: 'success',
        });
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'error',
            message: error.message
        })
    }
}

export const getRolesController = async (req, res) => {
    try {
        const roles = await new RoleService().getRoles();
        res.status(200).json({
            status: 'success',
            data: roles
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'error',
            message: error.message
        })
    }
}

export const editRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        await new RoleService().editRoleById(id, { name, description });
        res.status(200).json({
            status: 'success',
            message: 'Role updated successfully'
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'error',
            message: error.message
        })
    }
}

export const getRolesByNameController = async (req, res) => {
    try {
        const { name } = req.query;
        const roles = await new RoleService().getRoleByName(name);
        res.status(200).json({
            status: 'success',
            data: roles
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const deleteRoleByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        await new RoleService().deleteRoleById(id);
        res.status(201).json({
            status: 'success',
            message: 'Role deleted successfully'
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}