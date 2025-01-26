const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define(
    'gadget',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Name cannot be null',
                },
                notEmpty: {
                    msg: 'Name cannot be empty',
                },
            },
        },
        status: {
            type: DataTypes.ENUM('Available', 'Deployed', 'Destroyed', 'Decommissioned'),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Status cannot be null',
                },
                isIn: {
                    args: [['Available', 'Deployed', 'Destroyed', 'Decommissioned']],
                    msg: 'Status must be one of Available, Deployed, Destroyed, or Decommissioned',
                },
            },
        },
        createdBy: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
            },
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        paranoid: true,
        freezeTableName: true,
        modelName: 'gadget',
    }
);
