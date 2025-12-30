import { nanoid } from "nanoid";
import { UserRoles, Users } from "../models/Associations.js";

class UserRoleService {
    constructor() {
        this._UserRoles = UserRoles;
        this._Users = Users;
    }

    async addUserRole({ userId, roleId }) {
        const id = nanoid(16);
        const newRole = await this._UserRoles.create({
            id,
            user_id: userId,
            role_id: roleId
        });
        if (!newRole) {
            throw new Error("Failed to create user role");
        }
        return newRole.id;
    }

    async editUserRoleById(id, roleId) {
        const user = await this._Users.findOne({where: {id}});
        if (!user) {
            throw new Error("User not found");
        }

        await this._UserRoles.update({
            role_id: roleId
        }, {where: {user_id: id}});
        return;
    }
}

export default UserRoleService;