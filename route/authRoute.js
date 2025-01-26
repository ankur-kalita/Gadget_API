const { signup, login } = require('../controller/authController');

const router = require('express').Router();

router.route('/signup').post(signup);

router.post('/login', login);

module.exports = router;
