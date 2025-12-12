'use strict';

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/dbConn.js";

class Roles extends Model { };

Roles.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    },
    deleted_at: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Roles',
    tableName: 'roles',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Roles;