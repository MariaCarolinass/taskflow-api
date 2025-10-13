const ErrorMiddleware = (err, req, res, next) => {
    console.error("Erro interno:", err);
    res.status(err.status || 500).json({
        error: err.message || "Erro interno do servidor",
    });
};

export default ErrorMiddleware;