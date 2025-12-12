'use strict';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/dbConn.js';

class Users extends Model { };
Users.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'banned'),
            defaultValue: 'inactive'
        },
        last_login_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        otp_activation: {
            type: DataTypes.STRING
        },
        expires_otp: {
            type: DataTypes.DATE
        }
    },
    {
        sequelize,
        modelName: 'Users',
        tableName: 'users',
        timestamps: true,
        //sangat ngaruh
        paranoid: true,
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

export default Users;