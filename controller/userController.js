const { Sequelize } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const DB = require('../db');

const getAllUser = catchAsync(async (req, res, next) => {
    const users = await DB().user.findAndCountAll({
        attributes: { exclude: ['password'] },
    });
    return res.status(200).json({
        status: 'success',
        data: users,
    });
});

module.exports = { getAllUser };
