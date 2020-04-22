const express = require('express');
const validator = require('../middleware/validator');

const categoryController = require('../controllers/admin/category-manager');
const productController = require('../controllers/admin/product-manager');
const roleController = require('../controllers/admin/role-manager');
const userController = require('../controllers/admin/user-manager');
const { allowAccess, allowAction } = require('../middleware/auth');

const router = express.Router();

//----Category----//
router.get(
    '/category-manager',
    allowAccess('admin,manager'),
    categoryController.getCategoryManager,
);
router.get(
    '/category-manager/category',
    allowAccess('admin,manager'),
    categoryController.getCategory,
);
router.post(
    '/category-manager/add-category',
    allowAction('add_category'),
    validator.saveCategory(),
    categoryController.postAddCategory,
);
router.post(
    '/category-manager/update-category',
    allowAction('update_category'),
    validator.saveCategory(),
    categoryController.postUpdateCategory,
);
router.delete(
    '/category-manager/delete-category',
    allowAction('delete_category'),
    categoryController.deleteCategory,
);

//----Product----//
router.get(
    '/product-manager',
    allowAccess('admin,manager'),
    productController.getProductManager,
);
router.get(
    '/product-manager/products',
    allowAccess('admin,manager'),
    productController.getProducts,
);
router.get(
    '/product-manager/get-form',
    allowAccess('admin,manager'),
    productController.getForm,
);
router.post(
    '/product-manager/add-product',
    allowAction('add_product'),
    validator.saveProduct(),
    productController.postAddProduct,
);
router.post(
    '/product-manager/update-product',
    allowAction('update_product'),
    validator.saveProduct(),
    productController.postUpdateProduct,
);
router.delete(
    '/product-manager/delete-product',
    allowAction('delete_product'),
    productController.deleteProduct,
);

//----Role----//
router.get(
    '/role-manager',
    allowAccess('admin'),
    roleController.getRoleManager,
);
router.get(
    '/role-manager/get-roles',
    allowAccess('admin'),
    roleController.getRoles,
);
router.get(
    '/role-manager/get-commands',
    allowAccess('admin'),
    roleController.getCommands,
);
router.post(
    '/role-manager/add-role',
    allowAction('add_role'),
    validator.saveRole(),
    roleController.postAddRole,
);
router.post(
    '/role-manager/update-role',
    allowAction('update_role'),
    validator.saveRole(),
    roleController.postUpdateRole,
);
router.delete(
    '/role-manager/delete-role',
    allowAction('delete_role'),
    roleController.deleteRole,
);

//----User----//
router.get(
    '/user-manager',
    allowAccess('admin'),
    userController.getUserManager,
);
router.get(
    '/user-manager/get-users',
    allowAccess('admin'),
    userController.getUsers,
);
router.get(
    '/user-manager/get-user-info',
    allowAccess('admin'),
    userController.getUserInfo,
);
router.post(
    '/user-manager/update-user',
    allowAction('update_user'),
    validator.saveUser(),
    userController.postUpdateUser,
);

module.exports = router;
