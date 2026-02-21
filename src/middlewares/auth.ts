import { verifyToken } from "@authentication/session";

import type { Request, Response, NextFunction } from "express";

async function authenticationMiddleware(req: any, res: any, next: any) {
    const { auth_token } = req.cookies; 

    if (auth_token === undefined) return res.status(401).json({ error: "Unauthorized" });

    try {
        const payload: any = await verifyToken(auth_token);
        req.userId = payload.userId;
        
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

export default authenticationMiddleware;