'use strict';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/dbConn.js';

class ResetPassword extends Model { };

ResetPassword.init({
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
    otp_code: {
        type: DataTypes.STRING
    },
    expires_at: {
        type: DataTypes.DATE
    },
    used_at: {
        type: DataTypes.DATE
    },
    created_at: {
        type: DataTypes.DATE
    },
    access_token: {
        type: DataTypes.STRING
    }
},
    {
        sequelize,
        modelName: 'ResetPassword',
        tableName: 'password_resets',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        deletedAt: false
    })

export default ResetPassword