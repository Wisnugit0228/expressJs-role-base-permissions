'use strict';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/dbConn.js';

class RolePermissions extends Model { };
RolePermissions.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        role_id: {
            type: DataTypes.STRING,
            references: {
                model: 'roles',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        permission_id: {
            type: DataTypes.STRING,
            references: {
                model: 'permissions',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        created_at: {
            type: DataTypes.DATE
        },
        updated_at: {
            type: DataTypes.DATE
        }
    },
    {
        sequelize,
        modelName: 'RolePermissions',
        tableName: 'role_permissions',
        timestamps: true,
        //sangat ngaruh
        paranoid: false,
        deletedAt: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

export default RolePermissions;