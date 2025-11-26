const viewUserMiddleware = (req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
};

export default viewUserMiddleware;

