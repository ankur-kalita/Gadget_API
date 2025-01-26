const { authentication, restrictTo } = require('../controller/authController');
const {
    createGadget,
    getAllGadgets,
    getGadgetById,
    updateGadget,
    deleteGadget,
    triggerSelfDestruct,
    validateSelfDestruct, 
} = require('../controller/gadgetController');

const router = require('express').Router();

router
    .route('/')
    .post(authentication, createGadget)
    .get(authentication,  getAllGadgets);

router
    .route('/:id')
    .get(authentication, getGadgetById)
    .patch(authentication, updateGadget)
    .delete(authentication, deleteGadget);

router
    .post('/:id/self-destruct', authentication, triggerSelfDestruct); 


module.exports = router;
