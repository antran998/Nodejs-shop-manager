const {Op} = require('sequelize');

const { validationResult } = require('express-validator');
const { sequelize } = require('../../models/index');
const DataTable = require('../../helper/datatable-paging');
const Helper = require('../../helper/helpful-function');

const Users = require('../../models').user;
const Roles = require('../../models').role;

const {ViewDataHandler} = require('../../helper/view-data');

exports.getUserManager = async (req, res, next) => {
    try {
        const view = await ViewDataHandler('user-manager', req.session);
        res.render('admin/user/user-manager', {
            view: view
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const number = parseInt(req.query.order[0].column);
        const sortColumn = req.query.columns[number].data;
        const dataTable = new DataTable(
            Users,
            req.query.draw,
            req.query.start,
            req.query.length,
            sortColumn,
            req.query.order[0].dir,
            req.query.search.value,
        );
        const data = await dataTable.returnData();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getUserInfo = async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.query.id);        
        let userRoles = await user.getRoles({attributes: ['id']});
        userRoles = Helper.ConvertToPlain(userRoles);
        const roleObj = {};
        if(userRoles.length > 0) {
            userRoles.forEach(role => {
                roleObj[parseInt(role.id)] = 1;
            })
        }        
        const roles = await Roles.findAll();
        for(const role of roles) {
            if(roleObj[role.id] !== undefined) role.selected = 1;            
        }         
        console.log(Helper.ConvertToPlain(roles));
        res.render('admin/user/info-form', { user: user , roles : roles});
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postUpdateUser = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }
        const user = await Users.findByPk(req.body.id, { transaction: t });
        const updatedUser = await user.update(
            {
                name: req.body.name,
                phone: req.body.phone,
                age: req.body.age,
                gender: req.body.gender,
            },
            { transaction: t },
        );
        
        let choose = req.body.choose.split(',');
        choose = await Roles.findAll({
            where: {
                name: {
                    [Op.in]: choose,
                },
            },
            attributes: ['id'],
            transaction: t,
        });
        console.log(Helper.ConvertToPlain(choose));
        
        let remove = req.body.remove.split(',');
        console.log(remove);
        remove = await Roles.findAll(
            {
                where: {
                    name: {
                        [Op.in]: remove,
                    },
                },
                transaction: t,
                attributes: ['id'],
            },
        );        
        await updatedUser.removeRoles(remove, { transaction: t });
        await updatedUser.addRoles(choose, { transaction: t });
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
