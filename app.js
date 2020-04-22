const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

const session = require('./helper/session');
const CreateGuestSession = require('./helper/get-guest');

app.set('view engine', 'ejs');
app.set('views', 'views');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload-images');
    },
    filename: (req, file, cb) => {
        cb(
            null,
            new Date().toISOString().replace(/[-T:\.Z]/g, '') +
                file.originalname,
        );
    },
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const adminRoute = require('./routes/route-admin');
const errorController = require('./controllers/error');
const shopRoute = require('./routes/route-shop');

// middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    '/upload-images',
    express.static(path.join(__dirname, 'upload-images')),
);
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'),
);
app.use(session);

app.use(CreateGuestSession);

app.use('/admin', adminRoute);
app.use(shopRoute);

app.get('/500', errorController.get500Page);
app.use(errorController.get404Page);
app.use((error, req, res, next) => {
    res.redirect('/500');
});

app.listen(process.env.PORT, () =>
    console.log("Server's running at port " + process.env.PORT),
);
