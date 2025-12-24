import nodemailer from "nodemailer";
import { Users, ResetPassword } from "../models/Associations.js";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
class ResetPasswordService {

    constructor() {
        this._Users = Users;
        this._ResetPassword = ResetPassword;
    }
    async sendOtp(email) {
        const verificationCode = (Math.floor(100000 + Math.random() * 900000)).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        const user = await this._Users.findOne({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        }
        const userId = user.id;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const id = nanoid(16);
        const sendOtp = await this._ResetPassword.create({
            id,
            user_id: userId,
            otp_code: verificationCode,
            expires_at: expiresAt
        });
        if (!sendOtp) {
            throw new Error("Failed to send OTP");
        }

        await transporter.sendMail({
            to: email,
            subject: "Kode otp aktivasi email",
            html: `<p>Gunakan OTP ini untuk verifikasi email Anda: <b>${verificationCode}</b> (berlaku 5 menit)</p>`,
        });

        return {
            message: "Email verification code sent successfully"
        };
    }

    async verifyOtp({ email, token }) {
        const user = await this._Users.findOne({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        };
        const userId = user.id;
        const otp = await this._ResetPassword.findOne({
            where: {
                user_id: userId,
                otp_code: token,
                used_at: null
            }
        });

        if (!otp) {
            throw new Error("Invalid token");
        }

        const dateNow = new Date(Date.now());
        if (dateNow > otp.expires_at) {
            throw new Error("Token expired");
        }

        const accToken = jwt.sign({ userId }, process.env.RESET_PASSWORD_TOKEN, {
            expiresIn: '15m'
        })

        await this._ResetPassword.update({
            used_at: dateNow,
            access_token: accToken
        }, { where: { id: otp.id } });

        return {
            accToken
        }

    }

    async resendOtp(email) {
        const user = await this._Users.findOne({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        };
        const userId = user.id;
        const otp = await this._ResetPassword.findOne({
            where: {
                user_id: userId,
                used_at: null,
                access_token: null
            }
        });
        if (!otp) {
            throw new Error("Invalid token");
        };
        console.log(otp.id);

        const verificationCode = (Math.floor(100000 + Math.random() * 900000)).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        const newOtp = await this._ResetPassword.update({
            otp_code: verificationCode,
            expires_at: expiresAt
        }, { where: { id: otp.id } })
        if (newOtp === 0) {
            throw new Error("Failed to send OTP");
        }
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

        return {
            message: "Email verification code sent successfully"
        };

    }

    async resetpassword({ accessToken, password }) {
        const decoded = jwt.verify(accessToken, process.env.RESET_PASSWORD_TOKEN);
        const userId = decoded.userId;
        const otp = await this._ResetPassword.findOne({
            where: {
                user_id: userId
            }
        });
        if (!otp) {
            throw new Error("Invalid token");
        }
        const hashedPw = await bcrypt.hash(password, 10);

        const user = await this._Users.update({
            password: hashedPw
        }, { where: { id: userId } });

        if (user === 0) {
            throw new Error("Failed to reset password");
        }
        await this._ResetPassword.destroy({ where: { user_id: userId } });
        return {
            message: "Password reset successfully"
        }

    }

}

export default ResetPasswordService;