const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_KEY,
        },
    }),
);

const Helper = require('../../helper/helpful-function');
const { sequelize } = require('../../models/index');

const { SessionDataHandler } = require('../../helper/session-data');
const {ViewDataHandler} = require('../../helper/view-data');

const Users = require('../../models').user;
const Roles = require('../../models').role;

exports.getAuth = async (req, res, next) => {
    try {
        const view = await ViewDataHandler('authentication', req.session);                
        res.render('shop/auth/auth', { view: view });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getLogin = (req, res, next) => {
    try {
        res.render('shop/auth/login');
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getRegister = (req, res, next) => {
    try {
        res.render('shop/auth/register');
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getResetPassword = (req, res, next) => {
    try {
        res.render('shop/auth/reset-password');
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postRegister = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }
        const checkMail = await Users.count(
            {
                where: { email: req.body.email },
            },
            { transaction: t },
        );
        if (checkMail > 0) {
            const err = {
                param: 'email',
                msg: 'Email này đã tồn tại',
            };
            return res.status(422).json({
                validationErrors: [err],
            });
        }
        const emailCode = uuid();
        global.username = req.body.name;
        const newUser = await Users.create(
            {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                emailCode: emailCode,
            },
            { transaction: t },
        );
        
        const defaultRoles = await Roles.findOne({
            where:{code:'user'},
            attributes: ['id']
        })
        newUser.addRoles(defaultRoles.id, {transaction: t});
        await transporter.sendMail({
            to: req.body.email,
            from: 'fashion@shop.com',
            subject: 'Xác nhận email',
            html: `<a href="http://${process.env.URL}/authentication/confirm-email?code=${emailCode}">Bấm vào đây để xác thực</a>`,
        });
        await t.commit();
        res.status(200).json('success');
    } catch (err) {
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getConfirmEmail = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const user = {
            isEmailCheck: true,
            emailCode: null,
        };
        await Users.update(user, {
            where: { emailCode: req.query.code },
            transaction: t,
        });
        await t.commit();
        res.render('shop/auth/confirm-email');
    } catch (err) {
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postLogin = async (req, res, next) => {    
    try {
        const user = await Users.findOne({
            where: { email: req.body.email },            
        });
        if (!user) {
            const err = {
                param: 'email',
                msg: 'Email chưa đăng ký',
            };
            return res.status(422).json({
                validationErrors: [err],
            });
        }
        const doMatch = await bcrypt.compare(req.body.password, user.password);
        if (!doMatch) {
            const err = {
                param: 'password',
                msg: 'Mật khẩu không đúng',
            };
            return res.status(422).json({
                validationErrors: [err],
            });
        }
        if (!user.isEmailCheck) {
            const err = {
                param: 'email',
                msg: 'Email chưa xác thực',
            };
            return res.status(422).json({
                validationErrors: [err],
            });
        }
                
        const sessionData = await SessionDataHandler(user);
        global.username = user.name;
        req.session.user = sessionData;
                
        return res.status(200).json('success');        
    } catch (err) {        
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postResetPassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const checkMail = await Users.count({
            where: { email: req.body.email },
            transaction: t,
        });
        if (checkMail == 0) {
            const err = {
                param: 'email',
                msg: 'Email chưa đăng ký',
            };
            return res.status(422).json({
                validationErrors: [err],
            });
        }
        const resetCode = uuid();
        await transporter.sendMail({
            to: req.body.email,
            from: 'fashion@shop.com',
            subject: 'Xác nhận đổi mật khẩu',
            html: `<a href="http://${process.env.URL}/authentication/renew-password?code=${resetCode}">Bấm vào đây để đổi mật khẩu</a>`,
        });
        const user = {
            resetPasswordCode: resetCode,
        };
        await Users.update(user, {
            where: { email: req.body.email },
            transaction: t,
        });
        await t.commit();
        res.status(200).json('success');
    } catch (err) {
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getRenewPassword = async (req, res, next) => {
    try {
        const checkCode = await Users.count({
            where: { resetPasswordCode: req.query.code },
        });
        if(checkCode > 0) res.render('shop/auth/renew-password');
        else res.redirect('/404');
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postRenewPassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await Users.update(
            { password: hashedPassword , resetPasswordCode: null},
            { where: { resetPasswordCode: req.body.code }, transaction: t },
        );
        await t.commit();
        res.status(200).json('success');
    } catch (err) {
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getLogout = (req, res, next) => {    
    try {
        req.session.destroy(err => {
            res.status(200).json('success');
        });        
    } catch (err) {        
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}
