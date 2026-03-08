import { Router } from "express";
import CardController from "../controllers/CardController.js";
import authenticationMiddleware from "../middlewares/auth.js";

const router= Router();
const cardController = new CardController();

router.get("/cards", authenticationMiddleware, cardController.cards.bind(cardController));

export default router;