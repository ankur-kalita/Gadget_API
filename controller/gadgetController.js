const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');
const DB = require('../db');

const createGadget = catchAsync(async (req, res, next) => {
    const body = req.body;
    const newGadget = await DB().gadgets.create({
        name: body.name,
        status: body.status,
        createdBy: req.user.email,
    });

    return res.status(201).json({
        status: 'success',
        data: newGadget,
    });
});

const getAllGadgets = (async (req, res, next) => {
    const userId = req.user.email; // Retrieve the user email
    const { status } = req.query; // Extract the status query parameter

    console.log('====================================');
    console.log('User ID:', userId);
    console.log('Status Filter:', status);
    console.log('====================================');

    const queryOptions = {
        where: { createdBy: userId }, // Fetch gadgets created by the user
    };

    if (status) {
        queryOptions.where.status = status;
    }

    // Fetch the filtered results
    const result = await DB().gadgets.findAll(queryOptions);

    // Return the response
    return res.json({
        status: 'success',
        data: result,
    });
});


const getGadgetById = catchAsync(async (req, res, next) => {
    const gadgetId = req.params.id;
    const result = await DB().gadgets.findOne({
        where: { id: gadgetId },
    });
    if (!result) {
      return next(new AppError("Invalid gadget id", 400));
    }
    return res.json({
      status: "success",
      data: result,
    });
  });

const updateGadget = catchAsync(async (req, res, next) => {
    const gadgetId = req.params.id;
    const body = req.body;

    const result = await DB().gadgets.findOne({
        where: { id: gadgetId },
    });

    if (!result) {
        return next(new AppError('Invalid gadget id', 400));
    }

    result.name = body.name || result.name;
    result.status = body.status || result.status;

    const updatedResult = await result.save();

    return res.json({
        status: 'success',
        data: updatedResult,
    });
});

const deleteGadget = catchAsync(async (req, res, next) => {
    const gadgetId = req.params.id;

    const result = await DB().gadgets.findOne({
        where: { id: gadgetId},
    });

    if (!result) {
        return next(new AppError('Invalid gadget id', 400));
    }

    result.status = "Destroyed";
    await result.save();


    return res.json({
        status: 'success',
        message: 'Record deleted successfully',
        data: result,
    });
});

const triggerSelfDestruct = catchAsync(async (req, res, next) => {
    const gadgetId = req.params.id;

    const gadget = await DB().gadgets.findOne({
        where: { id: gadgetId },
    });
    if (!gadget) {
        return next(new AppError('Gadget not found', 404));
    }

    const generatedCode = crypto.randomInt(100000, 999999).toString();

    console.log(`Generated confirmation code for self-destruct: ${generatedCode}`);

    gadget.status = 'Decommissioned';
    await gadget.save();

    res.status(200).json({
        status: 'success',
        message: `Gadget self-destruct sequence completed and status updated to Decommissioned.`,
        data: {
            gadget,
            confirmationCode: generatedCode, 
        },
    });
});

module.exports = {
    createGadget,
    getAllGadgets,
    getGadgetById,
    updateGadget,
    deleteGadget,
    triggerSelfDestruct, 
};

