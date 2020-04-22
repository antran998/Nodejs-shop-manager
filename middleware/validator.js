const { body } = require('express-validator');

exports.saveCategory = () => {
    return [
        body('name')
            .trim()
            .isLength({ min: 2 })
            .withMessage('Bắt buộc, phải lớn 2 kí tự'),
        body('code')
            .trim()
            .matches(/^.+[^\W]$/)
            .withMessage('Bắt buộc, chỉ được tồn tại chữ'),
        body('description').trim(),
    ];
};

exports.saveRole = () => {
    return [
        body('name')
            .trim()
            .isLength({ min: 2 })
            .withMessage('Bắt buộc, phải lớn 2 kí tự'),
    ];
};

exports.saveUser = () => {
    return [
        body('name')
            .trim()
            .isLength({ min: 2 })
            .withMessage('Bắt buộc, phải lớn 2 kí tự'),
        body('phone', 'Bắt buộc độ dài là 10 và đều là số')
            .trim()
            .isLength(10)
            .custom((value) => {
                const check = value.match(/^0\d{9}$/g);
                if (check !== null) return true;
                return false;
            }),
        body('gender', 'Giới tính : Nam hoặc Nữ hoặc Khác')
            .trim()
            .custom((value) => {
                if (value == 'Nam' || value == 'Nữ' || value == 'Khác')
                    return true;
                return false;
            }),
        body('age', 'Tuổi phải từ 1-99')
            .trim()
            .custom((value) => {
                const check = value.match(/^[1-9][1-9]$/);
                if (check !== null) return true;
                return false;
            }),
    ];
};

exports.register = () => {
    return [
        body('name')
            .trim()
            .isLength({ min: 2 })
            .withMessage('Bắt buộc, phải lớn 2 kí tự'),
        body('email', 'Sai định dạng email').notEmpty().trim().isEmail(),
        body(
            'password',
            'Mật khẩu phải từ 8 ký tự gồm chữ thường, chữ hoa, số, ký tự đặc biệt',
        )
            .notEmpty()
            .custom((value) => {                
                const check = value.match(
                    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/g,
                );
                if (check !== null) return true;
                return false;
            }),
        body('confirm', 'Mật khẩu không khớp').notEmpty().custom(
            (value, { req }) => value === req.body.password,
        ),
    ];
};

exports.renew = () => {
    return [        
        body(
            'password',
            'Mật khẩu phải từ 8 ký tự gồm chữ thường, chữ hoa, số, ký tự đặc biệt',
        )
            .notEmpty()
            .custom((value) => {
                const check = value.match(
                    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/g,
                );
                if (check !== null) return true;
                return false;
            }),
        body('confirm', 'Mật khẩu không khớp')
            .notEmpty()
            .custom((value, { req }) => value === req.body.password),
    ];
};

exports.updateInfo = () => {
    return [
        body('phone', 'Sai định dạng').custom((value) => {
            const check = value.match(/^0\d{9}$/g);
            if (check !== null) return true;
            return false;
        }),
        body('gender', 'Chỉ được là "Nam"/"Nữ"/"Khác"').custom((value) => {                        
            if (value == "Nam" || value == "Nữ" || value == "Khác") return true;
            return false;
        }),
        body('age', '10 < Tuổi < 200').custom((value) => {
            const check = parseInt(value);
            if (check >= 10 && check <= 200) return true;
            return false;
        }),
    ];
};

exports.saveProduct = () => {
    return [
        body('name')
            .trim()
            .isLength({ min: 2 })
            .withMessage('Bắt buộc, phải lớn 2 kí tự'),
        body('price', 'Bắt buộc, giá phải là >= 1000đ')
            .isLength({min: 4})
            .custom(value => {
                const check = value.match(/^\d+$/g);
                if (check !== null) return true;
                return false;
            }),
    ];
};