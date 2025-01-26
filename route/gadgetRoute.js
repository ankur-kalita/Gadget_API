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
    .post(authentication, restrictTo('1'), createGadget)
    .get(authentication, restrictTo('1'), getAllGadgets);

router
    .route('/:id')
    .get(authentication, restrictTo('1'), getGadgetById)
    .patch(authentication, restrictTo('1'), updateGadget)
    .delete(authentication, restrictTo('1'), deleteGadget);

router
    .post('/:id/self-destruct', authentication, restrictTo('1'), triggerSelfDestruct); 

router
    .post('/:id/self-destruct/confirm', authentication, restrictTo('1'), validateSelfDestruct); 

module.exports = router;
