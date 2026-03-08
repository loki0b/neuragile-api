import { Router } from "express";
import CollectionController from "../controllers/CollectionController.js";
import authenticationMiddleware from "../middlewares/auth.js";

const router = Router();
const collectionController = new CollectionController();

router.get("/:id/getCollection", authenticationMiddleware, collectionController.getCollection.bind(collectionController));
router.get("/getAllCollections", authenticationMiddleware, collectionController.getAllCollections.bind(collectionController));
router.post("/createCollection", authenticationMiddleware, collectionController.createCollection.bind(collectionController));
router.post("/:id/addItem", authenticationMiddleware, collectionController.addItem.bind(collectionController));
router.get("/getAllItems", authenticationMiddleware, collectionController.getAllItems.bind(collectionController));

export default router;