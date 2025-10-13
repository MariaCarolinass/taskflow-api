const RoleMiddleware = {
    allowRoles: (roles = []) => (req, res, next) => {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (user.role === 'admin') {
            return next();
        }
        
        if (req.params.id && user.id === req.params.id) {
            return next();
        }
        
        if (!roles.includes(user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    }
};

export default RoleMiddleware;