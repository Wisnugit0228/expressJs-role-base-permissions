import { nanoid } from "nanoid";
import { Roles, Permissions } from "../models/Associations.js";
import { Op } from "sequelize";



class RoleService {
    constructor() {
        this._Roles = Roles;
    }

    async uniqRoleName(name) {
        const role = await this._Roles.findOne({ where: { name } });
        if (role) {
            throw new Error("Role name already exists");
        }
    }

    async createRole({ name, description }) {
        await this.uniqRoleName(name);
        const id = nanoid(16);
        const newRole = await this._Roles.create({
            id,
            name,
            description
        });
        if (!newRole) {
            throw new Error("Failed to create role");
        }
        return newRole.id;
    }

    async getRoles() {

        const roles = await this._Roles.findAll({
            attributes: ['name', 'description'],
            include: {
                model: Permissions,
                as: 'permissions',
                attributes: ['module', 'action', 'description'],
                through: { attributes: [] }
            }
        })
        if (!roles) {
            throw new Error("Failed to fetch roles");
        }

        return roles;

    }

    async editRoleById(id, { name, description }) {
        await this.uniqRoleName(name);
        const role = await this._Roles.findByPk(id);
        if (!role) {
            throw new Error("Role not found");
        };

        const newRole = await this._Roles.update({
            name,
            description
        }, {
            where: { id }
        });
        if (newRole[0] === 0) {
            throw new Error("Failed to update role");
        }
        return;
    }

    async getRoleByName(name) {
        const roles = await this._Roles.findAll({
            attributes: ['name', 'description'],
            where: {
                name: {
                    [Op.like]: `%${name.toLowerCase()}%`
                }
            }
        });

        return roles;
    }

    async deleteRoleById(id) {
        const role = await this._Roles.findByPk(id);
        if (!role) {
            throw new Error("Role not found");
        };

        const deletedRole = await this._Roles.destroy({
            where: { id }
        })
        if (deletedRole[0] === 0) {
            throw new Error("Failed to delete role");
        }
        return;
    }
}

export default RoleService;