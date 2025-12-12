'use strict';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/dbConn.js';

class UserRoles extends Model { };

UserRoles.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
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
        created_at: {
            type: DataTypes.DATE
        },
        updated_at: {
            type: DataTypes.DATE
        }
    },
    {
        sequelize,
        modelName: 'UserRoles',
        tableName: 'user_roles',
        timestamps: true,
        paranoid: false,
        deletedAt: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

export default UserRoles;