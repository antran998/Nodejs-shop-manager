const { validationResult } = require('express-validator');
const { sequelize } = require('../../models/index');
const { Op } = require('sequelize');

const Categories = require('../../models').category;
const Helper = require('../../helper/helpful-function');

const {ViewDataHandler} = require('../../helper/view-data');

exports.getCategoryManager = async (req, res, next) => {
    try {        
        const categories = await Categories.findAll();
        const view = await ViewDataHandler('category-manager', req.session);
        res.render('admin/category/category-manager', {
            categories: categories,
            view: view
        });        

    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postAddCategory = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        let image = req.file;
        if (image === undefined) image = '';
        else {
            image = image.path;
        }
        const checkCode = await Categories.count({
            where: {
                code: req.body.code,
            },
            transaction: t,
        });

        if (checkCode > 0) {
            if (req.file !== undefined) Helper.DeleteFile(req.file.path, next);
            const err = {
                param: 'code',
                msg: 'Code này đã tồn tại',
            };
            return res.status(422).json({
                validationErrors: [err],
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file !== undefined) Helper.DeleteFile(req.file.path, next);
            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }
        await Categories.create(
            {
                name: req.body.name,
                code: req.body.code,
                image: '\\' + image,
                description: req.body.description,
            },
            { transaction: t },
        );
        await t.commit();
        res.status(201).json('success');
    } catch (err) {
        if (req.file !== undefined) Helper.DeleteFile(req.file.path, next);
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getCategory = async (req, res, next) => {
    try {
        const category = await Categories.findByPk(req.query.id);
        res.status(200).json(category);
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postUpdateCategory = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file !== undefined) Helper.DeleteFile(req.file.path, next);
            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }

        const category = await Categories.findByPk(req.body.id, {
            transaction: t,
        });
        console.log(category);
        const checkCode = await Categories.count({
            where: {
                [Op.and]: {
                    code: req.body.code,
                    id: {
                        [Op.ne]: category.id,
                    },
                },
            },
            transaction: t,
        });
        if (checkCode > 0) {
            if (req.file !== undefined) Helper.DeleteFile(req.file.path, next);
            const err = {
                param: 'code',
                msg: 'Code này đã tồn tại',
            };
            const errors = [];
            errors.push(err);
            return res.status(422).json({
                validationErrors: errors,
            });
        }

        const newCategory = {};
        let image = req.file;
        if (image !== undefined) {
            Helper.DeleteFile(category.image, next);
            newCategory.image = '\\' + image.path;
        }
        newCategory.name = req.body.name;
        newCategory.code = req.body.code;
        newCategory.description = req.body.description;
        await Categories.update(
            newCategory,
            {
                where: {
                    id: category.id,
                },
            },
            { transaction: t },
        );
        await t.commit();
        res.status(201).json('success');
    } catch (err) {
        if (req.file !== undefined) Helper.DeleteFile(req.file.path, next);
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const category = await Categories.findByPk(req.query.id, {
            transaction: t,
        });
        await category.destroy({ transaction: t });
        if (category.image !== '') Helper.DeleteFile(category.image, next);
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
