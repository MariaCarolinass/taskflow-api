import Joi from "joi";

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid("user", "admin").optional()
});

export const validateBody = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
    next();
};