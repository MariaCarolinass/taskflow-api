const RoleMiddleware = {
    allowRoles: (roles = []) => (req, res, next) => {
      const { user } = req;
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      if (user.role === "admin") return next();
      if (roles.includes(user.role)) return next();
      return res.status(403).json({ error: "Forbidden" });
    }
  };
  
  export default RoleMiddleware;
  