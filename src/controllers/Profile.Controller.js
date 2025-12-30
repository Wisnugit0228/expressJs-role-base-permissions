import ProfileService from "../services/Profile.service.js";

export const getProfileController = async (req, res) => {
    try {
        const {userId} = req.user;
        const user = await new ProfileService().getProfileUserLogin(userId);
        res.status(200).json({
            status: "success",
            data: user
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: "fail",
            message: error.message
        })
    }
}

export const putProfileController = async (req, res) => {
    try {
        const {userId} = req.user;
        const { name, phone, gender, address } = req.body;
        const image = req.file;
        const user = await new ProfileService().editProfileUser(userId, { name, phone, gender, address, image });
        res.status(200).json({
            status: "success"
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: "fail",
            message: error.message
        })
    }
}

export const putAvatarProfileCOntroller = async (req, res) => {
    try {
        const {userId} = req.user;
        const image = req.file;
        const profile = await new ProfileService().editProfileAvatar(userId, image);
        res.status(200).json({
            status: "success",
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: "fail",
            message: error.message
        })
    }
}

export const deleteAvatarCOntroller = async (req, res) => {
    try {
        const {userId} = req.user;
        await new ProfileService().deleteAvatar(userId);
        res.status(200).json({
            status: "success",
        })
    } catch (error) {
        res.status(error.status || 400).json({
            status: "fail",
            message: error.message
        })
    }
}