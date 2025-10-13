import express from "express";
import UsersController from "../controllers/users.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import RoleMiddleware from "../middlewares/role.middleware.js";
import { updateUserSchema, validateBody } from "../validators/user.validator.js";

const router = express.Router();

router.get("/", AuthMiddleware.verifyToken, UsersController.getAllUsers);
router.get("/:id", AuthMiddleware.verifyToken, UsersController.getUserById);
router.put("/:id", AuthMiddleware.verifyToken, RoleMiddleware.allowRoles("admin"), validateBody(updateUserSchema), UsersController.updateUser);
router.delete("/:id", AuthMiddleware.verifyToken, RoleMiddleware.allowRoles("admin"), UsersController.deleteUser);

export default router;