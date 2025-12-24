import { Profiles, Users } from "../models/Associations.js";
import { deleteImage, uploadImage } from "./Bucket.service.js";
import UserService from "./User.service.js";

class ProfileService {
    constructor() {
        this._Profiles = Profiles;
        this._Users = Users;
    }

    async getProfileUserLogin(userId) {
        const user = await new UserService().getUserLoginById(userId);
        return user;
    }

    async editProfileUser(userId, { name, phone, gender, address, image }) {
        const user = await this._Profiles.findOne({ where: { user_id: userId } });
        const profileId = user.id;
        let key_avatar = user.key_avatar;
        let avatar = user.avatar;
        if (image) {
            if (user.avatar) {
                console.log(user.key_avatar);
                await deleteImage(user.key_avatar);
            }
            const newImage = await uploadImage(image);
            key_avatar = newImage.Key;
            avatar = newImage.Location;
        }

        await this._Profiles.update({
            name,
            phone: phone || null,
            gender,
            address: address || null,
            avatar,
            key_avatar
        }, { where: { id: profileId } });

        return "profile updated";
    }

    async editProfileAvatar(userId, image) {
        const user = await this._Profiles.findOne({
            where: { user_id: userId }
        });
        const profileId = user.id;
        let key_avatar = user.key_avatar;
        let avatar = user.avatar;
        if (!image) {
            throw new Error("Image not found");
        }
        if (user.avatar) {
            await deleteImage(user.key_avatar);
        }
        const newImage = await uploadImage(image)
        key_avatar = newImage.Key;
        avatar = newImage.Location;

        await this._Profiles.update({
            avatar,
            key_avatar
        }, { where: { id: profileId } });

        return "avatar profile updated";
    }

    async deleteAvatar(userId) {
        const user = await this._Profiles.findOne({ where: { user_id: userId } });
        const profileId = user.id;
        if (!user.avatar) {
            throw new Error("Avatar not found");
        }
        await deleteImage(user.key_avatar);
        await this._Profiles.update({
            avatar: null,
            key_avatar: null
        }, { where: { id: profileId } });
    }
}

export default ProfileService;