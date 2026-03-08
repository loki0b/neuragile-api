import { hash, compare } from "bcrypt";
import { prisma } from "../database/prisma.js";
import { createToken, verifyToken } from "../auth/session.js";

import type { Request, Response, NextFunction, CookieOptions } from "express";

const SALT_ROUNDS: number = 10;

class UserController {
   async register(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        // verify if user exists
        try {
            const hashedPassword: string = await hash(password, SALT_ROUNDS);
            const user = await prisma.user.create({
                data: { email, password: hashedPassword },
                select: { id: true, email: true }
            });

            return res.status(201).json({ status: "Account successfully created"});
        } catch (err) {
            console.log(err);
            return res.status(500);
        }
   }

   async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        try {
            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, email: true, password: true }
            });

            if (user === null) return res.send(401).json({ status: "Invalid credentials"});

            const validPassword: boolean = await compare(password, user.password);
            if (!validPassword) return res.status(401).json({ status: "Invalid credentials" }) // refactor

            const userToken: string = await createToken(
                { userId: user.id.toString() },
                { expiresIn: "1h"}
            );

            return res.status(200).json({
                status: "Login successfully",
                token: userToken
            });
        } catch (err) {
            console.log(err);

            return res.status(500).json({ status: "Server Error" });
        }
   }

   user(req: any, res: any, next: any) {
        return res.status(200).json({ userId: req.userId });
   }
}

export default UserController;