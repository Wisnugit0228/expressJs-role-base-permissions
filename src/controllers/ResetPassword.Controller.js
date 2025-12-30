import ResetPasswordService from "../services/ResetPassword.service.js";

export const sendOtpResetPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = await new ResetPasswordService().sendOtp(email);
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

export const verifyOtpCOntroller = async (req, res) => {
    try {
        const { email } = req.params;
        const { token } = req.body;
        const verifed = await new ResetPasswordService().verifyOtp({ email, token });
        res.status(200).json({
            status: 'success',
            data: verifed
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const resendOtpResetController = async (req, res) => {
    try {
        const { email } = req.params;
        const otp = await new ResetPasswordService().resendOtp(email);
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

export const resetpasswordController = async (req, res) => {
    try {
        const { accessToken, password } = req.body;
        const reset = await new ResetPasswordService().resetpassword({ accessToken, password });
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