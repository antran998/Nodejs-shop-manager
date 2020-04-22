const express = require('express');
const validator = require('../middleware/validator');

const authController = require('../controllers/shop/auth');
const userController = require('../controllers/shop/user');

const { allowAccess, allowAction } = require('../middleware/auth');

const router = express.Router();

//----Authentication----//
router.get('/authentication', authController.getAuth);
router.get('/authentication/login', authController.getLogin);
router.get('/authentication/register', authController.getRegister);
router.get('/authentication/reset-password', authController.getResetPassword);
router.get('/authentication/confirm-email', authController.getConfirmEmail);
router.get('/authentication/renew-password', authController.getRenewPassword);
router.get('/authentication/logout', authController.getLogout);
router.post(
    '/authentication/register',
    validator.register(),
    authController.postRegister,
);
router.post('/authentication/login', authController.postLogin);
router.post('/authentication/reset-password', authController.postResetPassword);
router.post(
    '/authentication/renew-password',
    validator.renew(),
    authController.postRenewPassword,
);

//----User info----//
router.get('/user-info',allowAccess('user'), userController.getUserInfo);
router.get('/update-password', allowAction('update_your_password'), userController.getChangePassword);
router.post(
    '/update-info',
    allowAction('update_your_info'),
    validator.updateInfo(),
    userController.postUpdateInfo,
);

module.exports = router;
