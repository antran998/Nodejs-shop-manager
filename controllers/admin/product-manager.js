const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { v4: uuid } = require('uuid');
const { sequelize } = require('../../models/index');

const Products = require('../../models').product;
const Props = require('../../models').product_prop;
const Categories = require('../../models').category;
const Helper = require('../../helper/helpful-function');

const { ViewDataHandler } = require('../../helper/view-data');
const Pagination = require('../../helper/pagination');

exports.getProductManager = async (req, res, next) => {
    try {
        const view = await ViewDataHandler('product-manager', req.session);
        const categories = await Categories.findAll({
            attributes: ['id', 'name'],
        });
        
        res.render('admin/product/product-manager', {
            view: view,
            categories: categories,
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const data = new Pagination(
            Products,
            req.query.currPage,
            req.query.searchField,
            req.query.searchValue,
            req.query.orderField,
            req.query.orderDir,
            req.query.optionField,
            req.query.optionValue
        );
        const products = await data.returnData();
        res.render('admin/product/products', { products: products });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getForm = async (req, res, next) => {
    try {
        let categories = await Categories.findAll({
            attributes: ['id', 'name'],
        });
        if (req.query.id !== undefined) {
            const product = await Products.findByPk(req.query.id, {
                include: Props,
            });
            return res.render('admin/product/product-form', {
                product: product,
                categories: categories,
            });
        }
        res.render('admin/product/product-form', {
            product: {},
            categories: categories,
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postAddProduct = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        let image = req.file;
        if (image === undefined) image = '';
        else {
            image = image.path;
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file !== undefined) Helper.DeleteFile(req.file.path, next);
            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }

        let newCode = null;
        let categoryId = null;
        if (req.body.cateId != 0) {
            const category = await Categories.findByPk(req.body.cateId, {
                attributes: ['code'],
            });
            const currProduct = await Products.findAll({
                where: { code: { [Op.substring]: category.code } },
                order: [['createdAt', 'DESC']],
                limit: 1,
                attributes: ['code'],
            });
            let number = 0;
            if (currProduct[0] !== undefined) {
                number = parseInt(
                    currProduct[0].code.substr(
                        currProduct[0].code.length - 4,
                        4,
                    ),
                );
            }
            newCode = Helper.CreateProductCode(category.code, number);
            categoryId = req.body.cateId;
        }

        await Products.create(
            {
                name: req.body.name,
                code: newCode,
                price: req.body.price,
                image: '\\' + image,
                categoryId: categoryId,
                product_prop: {
                    size: req.body.size,
                    color: req.body.color,
                },
            },
            { include: Props, transaction: t },
        );
        await t.commit();
        res.status(200).json('success');
    } catch (err) {
        if (req.file !== undefined) Helper.DeleteFile(req.file.path, next);
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postUpdateProduct = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file !== undefined) Helper.DeleteFile(req.file.path, next);
            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }

        const updateProduct = await Products.findByPk(req.body.id, {
            include: Props,
            transaction: t,
        });
        
        updateProduct.name = req.body.name;
        updateProduct.price = req.body.price;
        updateProduct.product_prop.size = req.body.size;
        updateProduct.product_prop.color = req.body.color;

        if (req.file !== undefined) updateProduct.image = '\\' + req.file.path;
        if (req.body.cateId != updateProduct.categoryId) {
            const category = await Categories.findByPk(req.body.cateId, {
                attributes: ['code'],
            });
            const currProduct = await Products.findAll({
                where: { code: { [Op.substring]: category.code } },
                order: [['updatedAt', 'DESC']],
                limit: 1,
                attributes: ['code'],
            });
            let number = 0;
            if (currProduct[0] !== undefined) {
                number = parseInt(
                    currProduct[0].code.substr(
                        currProduct[0].code.length - 4,
                        4,
                    ),
                );
            }
            
            const newCode = Helper.CreateProductCode(category.code, number);
            updateProduct.code = newCode;
            updateProduct.categoryId = req.body.cateId;
        }
        
        await updateProduct.save({ transaction: t });
        await t.commit();
        res.status(200).json('success');
    } catch (err) {
        if (req.file !== undefined) Helper.DeleteFile(req.file.path, next);
        await t.rollback();
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const product = await Products.findByPk(req.query.id, {
            transaction: t,
        });
        const image = product.image;
        await product.destroy({ transaction: t });
        if (image != '\\') Helper.DeleteFile(image, next);
        await t.commit();
        res.status(200).json('success');
    } catch (err) {
        console.log(err);
        await t.rollback();
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};
