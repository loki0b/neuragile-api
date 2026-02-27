import express, { json } from "express";
import cookieParser from "cookie-parser";
import userRoutes from "@routes/userRoutes"
import cardRoutes from "@routes/cardRoutes";
import collectionRoutes from "@routes/collectionRoutes";

import type { Express } from "express";

const app: Express = express();
const port: string | number = process.env["PORT"] || 8080;


app.use(json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/collections", collectionRoutes);

app.listen(port, () => {
    console.log(`Service running: http://localhost:${port}/`)
})