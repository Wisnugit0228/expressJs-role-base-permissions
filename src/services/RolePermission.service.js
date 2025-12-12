import { nanoid } from "nanoid";
import RolePermissions from "../models/RolePermissions.model.js"

class RolePermissionService {
    constructor() {
        this._RolePermissions = RolePermissions;
    }

    async createRolePermission({ role_id, permission_id }) {
        const id = nanoid(16);
        const newRolePermission = await this._RolePermissions.create({
            id,
            role_id,
            permission_id
        });
        if (!newRolePermission) {
            throw new Error("Failed to create role permission");
        }
        return newRolePermission.id;
    }

    async deleteRolePermissionById(id) {
        const RolePermission = await this._RolePermissions.findByPk(id);
        if (!RolePermission) {
            throw new Error("Role permission not found");
        }
        const deleted = await this._RolePermissions.destroy({ where: { id } });
        if (deleted === 0) {
            throw new Error("Failed to delete role permission");
        }
        return;
    }
}

export default RolePermissionService;