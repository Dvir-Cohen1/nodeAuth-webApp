export default (error, req, res, next) => {
     const backURL = req.header('Referer') || '/';

     req.flash('error', `${error.name}  ${error.message}`);
     res.status(error.statusCode || 500).redirect('/');
};
