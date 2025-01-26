const gadget = require('../db/models/gadget');
const user = require('../db/models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');

const createGadget = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id;
    const newGadget = await gadget.create({
        id: body.id,
        name: body.name,
        status: body.status, 
        createdBy: userId,
    });

    return res.status(201).json({
        status: 'success',
        data: newGadget,
    });
});

const getAllGadgets = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await gadget.findAll({
        include: user,
        where: { createdBy: userId },
    });

    return res.json({
        status: 'success',
        data: result,
    });
});

const getGadgetById = catchAsync(async (req, res, next) => {
    const gadgetId = req.params.id;
    const result = await gadget.findByPk(gadgetId, { include: user });
    if (!result) {
        return next(new AppError('Invalid gadget id', 400));
    }
    return res.json({
        status: 'success',
        data: result,
    });
});

const updateGadget = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const gadgetId = req.params.id;
    const body = req.body;

    const result = await gadget.findOne({
        where: { id: gadgetId, createdBy: userId },
    });

    if (!result) {
        return next(new AppError('Invalid gadget id', 400));
    }

    result.name = body.name;
    result.status = body.status;

    const updatedResult = await result.save();

    return res.json({
        status: 'success',
        data: updatedResult,
    });
});

const deleteGadget = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const gadgetId = req.params.id;

    const result = await gadget.findOne({
        where: { id: gadgetId, createdBy: userId },
    });

    if (!result) {
        return next(new AppError('Invalid gadget id', 400));
    }

    await result.destroy();

    return res.json({
        status: 'success',
        message: 'Record deleted successfully',
    });
});

const confirmationCodes = {};

const triggerSelfDestruct = catchAsync(async (req, res, next) => {
    const gadgetId = req.params.id;

    const gadget = await gadget.findByPk(gadgetId);
    if (!gadget) {
        return next(new AppError('Gadget not found', 404));
    }

    const generatedCode = crypto.randomInt(100000, 999999).toString();

    confirmationCodes[gadgetId] = { code: generatedCode, expiresAt: Date.now() + 5 * 60 * 1000 };

    res.status(200).json({
        status: 'success',
        message: 'Confirmation code generated. Use this code to confirm self-destruct.',
        confirmationCode: generatedCode,
    });
});

const validateSelfDestruct = catchAsync(async (req, res, next) => {
    const gadgetId = req.params.id;
    const { confirmationCode } = req.body;

    const gadget = await gadget.findByPk(gadgetId);
    if (!gadget) {
        return next(new AppError('Gadget not found', 404));
    }

    const storedCode = confirmationCodes[gadgetId];
    if (!storedCode || storedCode.code !== confirmationCode || Date.now() > storedCode.expiresAt) {
        return next(new AppError('Invalid or expired confirmation code', 400));
    }

    gadget.status = 'Destroyed';
    await gadget.save();

    delete confirmationCodes[gadgetId];

    res.status(200).json({
        status: 'success',
        message: 'Gadget self-destruct sequence triggered',
        data: gadget,
    });
});

module.exports = {
    createGadget,
    getAllGadgets,
    getGadgetById,
    updateGadget,
    deleteGadget,
    triggerSelfDestruct, 
    validateSelfDestruct, 
};

