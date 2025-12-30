import { nanoid } from "nanoid";
// import Users from "../models/Users.model.js";
import { Users, Profiles, UserRoles, Roles, RolePermissions, Permissions, Tokens } from "../models/Associations.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import moment from "moment";
import { where } from "sequelize";

class UserService {
    constructor() {
        this._Users = Users;
        this._Profiles = Profiles;
        this._UserRoles = UserRoles;
        this._Roles = Roles;
        this._Tokens = Tokens;
        this._Permissions = Permissions;
    }

    async uniqUserEmail(email) {

        const user = await this._Users.findOne({ where: { email } });
        if (user) {
            console.log(email);
            throw new Error("Email already exists");
        }
    }

    async emailVerificationCode(email) {
        const verificationCode = (Math.floor(100000 + Math.random() * 900000)).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            to: email,
            subject: "Kode otp aktivasi email",
            html: `<p>Gunakan OTP ini untuk verifikasi email Anda: <b>${verificationCode}</b> (berlaku 5 menit)</p>`,
        });

        await this._Users.update({
            otp_activation: verificationCode,
            expires_otp: expiresAt
        }, { where: { email } });

        return {
            message: "Email verification code sent successfully"
        };
    }

    async addProfileToUser(userId) {
        //membuat profile kosong untuk user yang baru dibuat
        const id = nanoid(16);
        await this._Profiles.create({
            id,
            user_id: userId
        })

    }

    async assignRoleToUser(userId, name) {
        const role = await this._Roles.findOne({ where: { name } });
        const roleId = role.id;

        const id = nanoid(16);
        await this._UserRoles.create({
            id,
            user_id: userId,
            role_id: roleId
        })
    }

    async createUser({ email, password }) {
        await this.uniqUserEmail(email);
        const id = nanoid(16);
        const hashedPw = await bcrypt.hash(password, 10);
        const newUser = await this._Users.create({
            id,
            email,
            status: 'inactive',
            password: hashedPw
        });
        if (!newUser) {
            throw new Error("Failed to create user");
        }

        //send  email
        await this.emailVerificationCode(email);

        const userId = newUser.id;
        await this.addProfileToUser(userId)
        await this.assignRoleToUser(userId, 'user');

        return newUser.id;
    }

    async verifyEmailUser(email, otp) {
        const user = await this._Users.findOne({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        }

        if (user.otp_activation !== otp) {
            throw new Error("Invalid OTP");
        }
        const dateNow = new Date(Date.now());
        if (dateNow > user.expires_otp) {
            throw new Error("OTP expired");
        }

        await this._Users.update({
            status: 'active',
            otp_activation: null,
            expires_otp: null
        }, { where: { email } });

        return {
            message: "Email verified"
        };
    }

    async getUserLoginById(userId) {

        console.log(userId);
        
        const user = await this._Users.findOne({
            where: { id: userId },
            attributes: ['email', 'status'],
            include: [
                {
                    model: Profiles,
                    as: 'profile',
                    attributes: ['name', 'phone', 'avatar', 'address', 'gender']
                },
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name'],
                    through: { attributes: [] }
                }
            ]
        });

        return user;
    }


    async getAllUsers() {
        const users = await this._Users.findAll({
            attributes: ['email', 'status', 'last_login_at'],
            include: [
                {
                    model: Profiles,
                    as: 'profile',
                    attributes: ['name', 'phone', 'avatar', 'address', 'gender']
                },
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name'],
                    include: {
                        model: Permissions,
                        as: 'permissions',
                        attributes: ['module', 'action', 'description'],
                        through: { attributes: [] }
                    },
                    through: { attributes: [] }
                }
            ]
        });
        return users;
    }

    async LoginUser({ email, password, user_agent, ip_address }) {
        const user = await this._Users.findOne({ 
            where: { email },
            include: {
                model: this._Roles,
                    as: 'roles',
                    attributes: ['name'],
                    include: {
                        model: this._Permissions,
                        as: 'permissions',
                        attributes: ['module', 'action', 'description'],
                        through: { attributes: [] }
                    },
                    through: { attributes: [] }
            }
        });
        if (!user) {
            throw new Error("User not found");
        };
        if (user.status === 'inactive') {
            throw new Error("please activate your account");
        };
        if (user.status === 'banned') {
            throw new Error("you are banned");
        };
        const matchPw = await bcrypt.compare(password, user.password);
        if (!matchPw) {
            throw new Error("wrong password");
        };

        const roles = user.roles.map(r => r.name);
        const permissions = user.roles.flatMap(role =>
        role.permissions.map(p => `${p.module}:${p.action}`)
        );

        const uniquePermissions = [...new Set(permissions)];

        const payload = {
            sub: user.id,
            email: user.email,
            roles,
            permissions: uniquePermissions,
        };

        const userId = user.id;
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

        const expiresAt = moment().add(30, 'days').toDate();
        const last_login_at = new Date(Date.now());
        const id = nanoid(16);
        await this._Tokens.create({
            id,
            user_id: userId,
            token: refreshToken,
            expires_at: expiresAt,
            user_agent,
            ip_address,
            revoked: false
        });

        const rest = await this._Users.update({
            last_login_at,
        }, { where: { email } })



        return {
            accessToken,
            refreshToken
        }
    }

    async LogoutUser(refreshToken) {
        if (!refreshToken) {
            throw new Error("Refresh token not found");
        };

        const token = await this._Tokens.findOne({ where: { token: refreshToken } });
        if (!token) {
            throw new Error("Refresh token not found");
        };

        await this._Tokens.update({
            revoked: true
        }, { where: { token: refreshToken } });

        return {
            message: "Logout success"
        }
    }

    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new Error("Refresh token not found");
        };

        const token = await this._Tokens.findOne({
            include: {
                model: Users,
                as: 'user',
                attributes: ['id', 'email']
            },
            where: { token: refreshToken, revoked: false }
        });

        if (!token) {
            throw new Error("Refresh token invalid");
        };

        if (new Date(Date.now()) > token.expires_at) {
            throw new Error("Refresh token expired");

        }
        const userId = token.user.id;
        const user = await this._Users.findOne({
            where: {id: userId},
            attributes: ['id', 'email'],
            include: {
                model: this._Roles,
                    as: 'roles',
                    attributes: ['name'],
                    include: {
                        model: this._Permissions,
                        as: 'permissions',
                        attributes: ['module', 'action', 'description'],
                        through: { attributes: [] }
                },
                through: { attributes: [] }
            }
        });
        const roles = user.roles.map(r => r.name);
        const permissions = user.roles.flatMap(role =>
        role.permissions.map(p => `${p.module}:${p.action}`)
        );

        const uniquePermissions = [...new Set(permissions)];

        const payload = {
            sub: user.id,
            email: user.email,
            roles,
            permissions: uniquePermissions,
        };
        const email = token.user.email;
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        return {
            accessToken
        }

    }

}

export default UserService;