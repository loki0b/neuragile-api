import { Router } from "express";
import authenticationMiddleware from "src/middlewares/auth.js";
import ChatController from "src/controllers/ChatController.js";

const router = Router();
const chatController = new ChatController();

router.post("/sendMessage", authenticationMiddleware, chatController.sendMessage.bind(chatController));

export default router;