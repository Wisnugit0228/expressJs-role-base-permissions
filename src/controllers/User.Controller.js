import e from "express";
import UserService from "../services/User.service.js";

export const postUserControlller = async (req, res) => {
    try {
        const { email, password } = req.body;
        const newUser = await new UserService().createUser({ email, password });
        res.status(201).json({
            status: 'success',
        });
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const getAllUsersController = async (req, res) => {
    try {
        const users = await new UserService().getAllUsers();
        res.status(200).json({
            status: 'success',
            data: users
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const verfifyEmailUserController = async (req, res) => {
    try {
        const { email } = req.params;
        const { otp } = req.body;
        const verified = await new UserService().verifyEmailUser(email, otp);
        res.status(200).json({
            status: 'success',
            data: verified
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const resendOtpController = async (req, res) => {
    try {
        const { email } = req.params;
        const newOtp = await new UserService().emailVerificationCode(email);
        res.status(200).json({
            status: 'success'
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const LoginController = async (req, res) => {
    try {
        const ip_address = req.ip;
        const user_agent = req.headers['user-agent'];
        const { email, password } = req.body;
        const token = await new UserService().LoginUser({ email, password, user_agent, ip_address });
        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: 'strict',
            // path: '/refresh-token',
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        res.status(200).json({
            status: 'success',
            data: token
        });
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        });
    }
}

export const LogoutUserController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const logout = await new UserService().LogoutUser(refreshToken);
        res.clearCookie('refreshToken');
        res.status(200).json({
            status: 'success'
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const refreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const token = await new UserService().refreshToken(refreshToken);
        res.status(200).json({
            status: 'success',
            data: token
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const getUserLoginByIdController = async (req, res) => {
    try {
        const {userId} = req.user;
        const user = await new UserService().getUserLoginById(userId);
        res.status(200).json({
            status: 'success',
            data: user
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}