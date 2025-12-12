import Roles from "./Roles.model.js";
import Permissions from "./Permissions.model.js";
import RolePermissions from "./RolePermissions.model.js";
import Users from "./Users.model.js";
import Profiles from "./Profiles.model.js";
import UserRoles from "./UserRoles.model.js";
import Tokens from "./RefreshTokens.model.js"



Users.hasOne(Profiles, {
    as: 'profile',
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Profiles.belongsTo(Users, {
    as: 'user',
    foreignKey: 'user_id'
});

Users.belongsToMany(Roles, {
    as: 'roles',
    through: UserRoles,
    foreignKey: 'user_id'
})

Users.hasMany(Tokens, {
    as: 'tokens',
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Tokens.belongsTo(Users, {
    as: 'user',
    foreignKey: 'user_id'
});

Roles.belongsToMany(Users, {
    through: UserRoles,
    foreignKey: 'role_id'
})

Roles.belongsToMany(Permissions, {
    through: RolePermissions,
    as: 'permissions',
    foreignKey: 'role_id'
});

Permissions.belongsToMany(Roles, {
    through: RolePermissions,
    as: 'roles',
    foreignKey: 'permission_id'
});



export { UserRoles, Users, Profiles, Roles, Permissions, RolePermissions, Tokens };
