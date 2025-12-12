'use strict';
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/dbConn.js";

class Permissions extends Model { };

Permissions.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        module: {
            type: DataTypes.STRING,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        created_at: {
            type: DataTypes.DATE,
        },
        updated_at: {
            type: DataTypes.DATE,
        }
    },
    {
        sequelize,
        modelName: 'Permissions',
        tableName: 'permissions',
        timestamps: true,
        paranoid: false,
        deletedAt: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

export default Permissions;