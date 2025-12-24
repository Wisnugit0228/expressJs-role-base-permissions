import { nanoid } from "nanoid";
import { Users, Tokens } from "../models/Associations.js";
import UserService from "./User.service.js";
import bcrypt from "bcrypt";

class SuperAdminService {
    constructor() {
        this._Users = Users;
        this._Tokens = Tokens;
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

    async deleteUser(email) {
        const user = await this._Users.findOne({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        }
        await this._Users.destroy({ where: { email } });
        return "User deleted";
    }

    async loginHistories() {
        const loginHistories = await this._Users.findAll({
            attributes: ['email'],
            include: {
                model: this._Tokens,
                as: 'tokens',
                attributes: ['user_agent', 'ip_address', 'created_at'],
                where: { revoked: false }
            }
        })
        return loginHistories;
    }
}

export default SuperAdminService;