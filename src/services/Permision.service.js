import { nanoid } from "nanoid";
import Permissions from "../models/Permissions.model.js"

class PermissionService {
    constructor() {
        this._Permissions = Permissions;
    }

    async uniqPermission(module, action) {
        const permission = await this._Permissions.findOne({
            where: { module, action }
        });
        if (permission) {
            throw new Error("Permission already exists");
        }
    }

    async createPermission({ module, action, description }) {
        const id = nanoid(16);
        await this.uniqPermission(module, action);
        const newPermission = await this._Permissions.create({
            id,
            module,
            action,
            description
        })
        if (!newPermission) {
            throw new Error("Failed to create permission");
        }
        return newPermission.id;
    }

    async getPermissions() {
        const permissions = await this._Permissions.findAll({ attributes: ['id', 'module', 'action', 'description'] });
        return permissions;
    }

    async editPermissionById(id, { module, action, description }) {
        await this.uniqPermission(module, action);
        const permission = await this._Permissions.findByPk(id);
        if (!permission) {
            throw new Error("Permission not found");
        }
        const newPermission = await this._Permissions.update({
            module,
            action,
            description
        }, { where: { id } });

        if (newPermission[0] === 0) {
            throw new Error("Failed to update permission");
        }
        return;
    }

    async deletePermissionById(id) {
        const permission = await this._Permissions.findByPk(id);
        if (!permission) {
            throw new Error("Permission not found");
        };
        const deletedRole = await this._Permissions.destroy({
            where: { id }
        });
        if (deletedRole === 0) {
            throw new Error("Failed to delete permission");
        }
        return;
    }
}

export default PermissionService;