import { hash, compare } from "bcrypt";
import { prisma } from "src/lib/PrismaClient.js";
import { createToken } from "src/auth/session.js";

import type { Request, Response, NextFunction } from "express";
import { error } from "node:console";

const SALT_ROUNDS: number = 10;

class UserController {
   async register(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        try {
            const userExists = await prisma.user.findFirst({
                where: { email: "email" }
            });

            if (userExists === null) return res.status(409).json({status: "The user already exists"})

            const hashedPassword: string = await hash(password, SALT_ROUNDS);
            await prisma.user.create({
                data: { email: email, password: hashedPassword },
            });

            return res.status(201).json({ status: "Account successfully created"});
        } catch (err) {
            return res.status(500).json({status: "Server error"});
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