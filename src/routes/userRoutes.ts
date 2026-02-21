import UserController from "@controllers/UserController"
import authenticationMiddleware from "../middlewares/auth";
import { Router } from "express";

const router: Router = Router();
const userController = new UserController();

router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.post("/logout", userController.logout.bind(userController));
router.get("/user", authenticationMiddleware, userController.user.bind(userController));

export default router;