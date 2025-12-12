import { nanoid } from "nanoid";
import { Users } from "../models/Associations.js";
import UserService from "./User.service.js";
import bcrypt from "bcrypt";

class SuperAdminService {
    constructor() {
        this._Users = Users;
    }

    async createUser({ email, password, role }) {
        const id = nanoid(16);
        const hashedPw = await bcrypt.hash(password, 10);
        const user = await this._Users.create({
            id,
            status: 'active',
            email,
            password: hashedPw
        });
        if (!user) {
            throw new Error("Failed to create user");
        };
        const userId = user.id;
        await new UserService().addProfileToUser(userId);
        const userRole = role.toLowerCase().trim();
        await new UserService().assignRoleToUser(userId, userRole);
        return user.id;

    }
}

export default SuperAdminService;