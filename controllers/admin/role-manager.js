const { validationResult } = require('express-validator');
const { sequelize } = require('../../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Roles = require('../../models').role;
const Navigation = require('../../models').navigation;
const Commands = require('../../models').command;

const {ViewDataHandler} = require('../../helper/view-data');

exports.getRoleManager = async (req, res, next) => {
    try {
        const view = await ViewDataHandler('role-manager', req.session);
        res.render('admin/role/role-manager', {
            view: view
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getRoles = async (req, res, next) => {
    try{
        const roles = await Roles.findAll();
        res.render('admin/role/roles-section', {roles: roles});
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }    
};

exports.getCommands = async (req, res, next) => {
    try {
        let commands;
        let roleName = '';
        if(req.query.id !== undefined) {
            commands = await Commands.findAll();
            const roleCommands = await Roles.findByPk(req.query.id, {
                include: Commands
            });
            
            const temp = {}
            roleCommands.commands.forEach(item => {
                if(item.role_command.roleId == req.query.id) {
                    temp[item.role_command.commandId] = 1;
                }
            });

            commands.forEach((item) => {
                if(temp[item.id] !== undefined) item.check = 1;
            });
            roleName = roleCommands.name;     
        }
        else {
            commands = await Commands.findAll();            
        }
        res.render('admin/role/role-form', {
            commands: commands,
            roleName: roleName
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postAddRole = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }
        const checkName = await Roles.count({
            where:{name: req.body.name},
            transaction: t
        })
        if(checkName>0) {
            const err = {
                param: 'name',
                msg: 'Tên này đã tồn tại',
            };
            return res.status(422).json({
                validationErrors: [err],
            });
        }      
        
        const newRole = await Roles.create(
            {
                name: req.body.name,
            },
            { transaction: t },
        );
        // const newRole = await Roles.findOne({where:{ name: req.body.name}});
        let choose = [];
        req.body.choose.forEach((item) => {                       
            choose.push(parseInt(item));
        });        
        await newRole.addCommands(choose, { transaction: t });
        await t.commit();
        return res.status(200).json('success');
    } catch (err) {
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.postUpdateRole = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }
        const checkName = await Roles.count({
            where: {
                [Op.and]: {
                    name: req.body.name,
                    id: {
                        [Op.ne]: req.body.id,
                    },
                },
            },
            transaction: t,
        });
        if (checkName > 0) {
            const err = {
                param: 'name',
                msg: 'Tên này đã tồn tại',
            };
            return res.status(422).json({
                validationErrors: [err],
            });
        }
        const role = await Roles.findByPk(req.body.id, {transaction: t});
        await role.update(
            {
                name: req.body.name,
            },
            { transaction: t },
        );
        
        let choose = [];
        req.body.choose.forEach((item) => {
            choose.push(parseInt(item));
        });
        let remove = [];
        req.body.remove.forEach((item) => {
            remove.push(parseInt(item));
        });
        
        if(choose.length > 0) 
            await role.addCommands(choose, { transaction: t });
        if (remove.length > 0)
            await role.removeCommands(remove, { transaction: t });
        await t.commit();
        return res.status(200).json('success');
    } catch (err) {
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.deleteRole = async(req, res, next) => {
    const t = await sequelize.transaction();
    try{
        const role = await Roles.findByPk(req.query.id, {transaction: t});
        await role.destroy({transaction: t});
        await t.commit();
        res.status(200).json('success');
    } catch (err) {
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}