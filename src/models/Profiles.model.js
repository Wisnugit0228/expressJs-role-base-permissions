'use strict';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/dbConn.js';

class Profiles extends Model { };

Profiles.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: 'CASCADE'
    },
    phone: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING
    },
    avatar: {
        type: DataTypes.TEXT,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        defaultValue: 'other'
    },
    address: {
        type: DataTypes.TEXT
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    sequelize,
    modelName: 'Profiles',
    tableName: 'user_profiles',
    timestamps: true,
    paranoid: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false
})

export default Profiles;