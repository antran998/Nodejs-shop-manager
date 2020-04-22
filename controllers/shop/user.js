const { sequelize } = require('../../models/index');

const Users = require('../../models').user;

const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { v4: uuid } = require('uuid');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_KEY,
        },
    }),
);

exports.getUserInfo = async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.session.user.id);
        res.render('shop/user/user-info', { user: user });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postUpdateInfo = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }
        await Users.update(
            {
                phone: req.body.phone,
                gender: req.body.gender,
                age: req.body.age,
            },
            { where: { id: req.session.user.id } },
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

exports.getChangePassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const user = await Users.findByPk(req.session.user.id, {
            attributes: ['email'],
        });
        const resetCode = uuid();
        await transporter.sendMail({
            to: user.email,
            from: 'fashion@shop.com',
            subject: 'Xác nhận đổi mật khẩu',
            html: `<a href="http://${process.env.URL}/authentication/renew-password?code=${resetCode}">Bấm vào đây để đổi mật khẩu</a>`,
        });
        const codeUser = {
            resetPasswordCode: resetCode,
        };
        await Users.update(codeUser, {
            where: { email: user.email },
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
