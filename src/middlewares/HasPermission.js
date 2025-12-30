import { Users, Roles, Permissions } from "../models/Associations.js";

export const hasPermission = (module, action) => {
    return async (req, res, next) => {
        try {
            const {userId} = req.user;

            const user = await Users.findOne({
                where: { id: userId },
                include: {
                    model: Roles,
                    as: 'roles',
                    include: {
                        model: Permissions,
                        as: 'permissions',
                    }
                }
            });
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            // 🔥 SUPER ADMIN BYPASS
            const isSuperAdmin = user.roles.some(
                role => role.name === 'super admin'
            );

            if (isSuperAdmin) {
                return next();
            }

            const permissions = user.roles.flatMap(role => role.permissions);

            const allowed = permissions.some(
                p => p.module === module && p.action === action
            );

            if (!allowed) {
                return res.status(403).json({ message: "Forbidden: no permission" });
            }

            next();

        } catch (error) {
            res.status(500).json({ message: err.message });
        }
    }
}