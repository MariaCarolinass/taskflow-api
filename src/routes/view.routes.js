import { Router } from "express";
import { renderDashboard, renderTaskCreate, renderTaskEdit, renderTaskDetails, createTaskView, updateTaskView, deleteTaskView } from "../controllers/views/view.controller.js";
import { renderRegister, renderLogin, loginView, logoutView, registerView } from "../controllers/views/viewAuth.controller.js";
import viewAuthMiddleware from "../middlewares/views/viewAuth.middleware.js";

const router = Router();

router.get("/login", renderLogin);
router.post("/login", loginView);
router.get("/logout", logoutView);

router.get("/register", renderRegister);
router.post("/register", registerView);

router.get("/", viewAuthMiddleware, renderDashboard);
router.get("/dashboard", viewAuthMiddleware, renderDashboard);
router.get("/tasks", viewAuthMiddleware, renderDashboard);

router.get("/tasks/create", viewAuthMiddleware, renderTaskCreate);
router.post("/tasks", viewAuthMiddleware, createTaskView);
router.get("/tasks/:id", viewAuthMiddleware, renderTaskDetails);
router.get("/tasks/edit/:id", viewAuthMiddleware, renderTaskEdit);
router.post("/tasks/edit/:id", viewAuthMiddleware, updateTaskView);
router.post("/tasks/delete/:id", viewAuthMiddleware, deleteTaskView);

export default router;



