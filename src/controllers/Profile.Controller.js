import ProfileService from "../services/Profile.service.js";

export const getProfileController = async (req, res) => {
    try {
        const id = req.userId;
        const user = await new ProfileService().getProfileUserLogin(id);
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
        const id = req.userId;
        const { name, phone, gender, address } = req.body;
        const image = req.file;
        const user = await new ProfileService().editProfileUser(id, { name, phone, gender, address, image });
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

export const putAvatarProfileCOntroller = async (req, res) => {
    try {
        const id = req.userId;
        const image = req.file;
        const profile = await new ProfileService().editProfileAvatar(id, image);
        res.status(200).json({
            status: "success",
            data: profile
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
        const id = req.userId;
        await new ProfileService().deleteAvatar(id);
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