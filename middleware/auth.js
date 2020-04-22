const Roles = require('../models').role;
const Commands = require('../models').command;

const { Op } = require('sequelize');
const Helper = require('../helper/helpful-function');

exports.allowAccess = (roles) => {
    roles = roles.split(',');
    return async (req, res, next) => {
        try {
            if (req.session.user != undefined) {
                const allowRoles = await Roles.findAll({
                    where: { code: { [Op.in]: roles } },
                });
                const roleTable = {};
                for (const role of req.session.user.roles) {
                    roleTable[parseInt(role)] = 1;
                }

                for (const role of allowRoles) {
                    if (roleTable[role.id] != undefined) {
                        global.username = req.session.user.name;
                        return next();
                    }
                }
                res.redirect('/500');
            } else res.redirect('/500');
        } catch (err) {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    };
};

exports.allowAction = (command) => {
    return async (req, res, next) => {
        try {
            if (req.session.user.name != '_guest') {
                const allowCommand = await Commands.findOne({
                    where: { code: command },
                });
                
                if (allowCommand != undefined) {
                    const isAllow = req.session.user.commands.find((id) => id == allowCommand.id);                    
                    if (isAllow != undefined) return next();
                }

                if (req.file !== undefined)
                    Helper.DeleteFile(req.file.path, next);
                res.redirect('/500');
            } else res.redirect('/500');
        } catch (err) {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    };
};
