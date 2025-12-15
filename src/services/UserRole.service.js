import { nanoid } from "nanoid";
import { UserRoles } from "../models/Associations.js";

class UserRoleService {
    constructor() {
        this._UserRoles = UserRoles;
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
}

export default UserRoleService;