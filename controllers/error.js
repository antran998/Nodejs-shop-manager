exports.get404Page = (req,res,next) => {
    res.status(404).render('error/404');
}

exports.get500Page = (req, res, next) => {
    res.status(500).render('error/500');
};