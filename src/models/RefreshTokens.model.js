'use strict';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/dbConn.js';

class Tokens extends Model { };

Tokens.init({
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
    token: {
        type: DataTypes.TEXT
    },
    user_agent: {
        type: DataTypes.STRING
    },
    ip_address: {
        type: DataTypes.STRING
    },
    expires_at: {
        type: DataTypes.DATE
    },
    revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Tokens',
    tableName: 'refresh_tokens',
    timestamps: true,
    paranoid: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default Tokens;