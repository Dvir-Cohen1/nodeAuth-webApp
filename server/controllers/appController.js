import AppError from "../utils/AppError.js";

export function getIndexPage(req, res, next) {
     let flash = req.flash();
     res.render('./pages/index', { flash });

}

export function getAboutPage(req, res, next) {
     let flash = req.flash();
     res.render('./pages/about', { flash });

}

export function getDocPage(req, res, next) {
     let flash = req.flash();
     try {
          res.render('./pages/docs', { flash });
     } catch (error) {
          next(new AppError(error.message));
     }
}

export function getPlansPage(req, res, next) {
     let flash = req.flash();
     try {
          res.render('./pages/plans', { flash });
     } catch (error) {
          next(new AppError(error.message));
     }
}

export function pageNotFound404(req, res, next) {
     next(new AppError("Page not found"))
}