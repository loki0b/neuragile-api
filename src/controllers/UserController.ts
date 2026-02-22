import { hash, compare } from "bcrypt";
import { prisma } from "@database/prisma";
import { createToken, verifyToken } from "@authentication/session";

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

            const cookieOptions: CookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 1000, // 1h in ms
                sameSite: "strict"
            };

            return res.status(200).cookie("auth_token", userToken, cookieOptions).json({
                status: "Login successfully"
            });
        } catch (err) {
            console.log(err);

            return res.status(500).json({ status: "Server Error" });
        }
   }

   logout(req: any, res: any, next: any) {
        res.clearCookie("auth_token", { path: "/" }).status(200).json({ status: "Logout successfuly" });
   }

   user(req: any, res: any, next: any) {
        return res.status(200).json({ userId: req.userId });
   }
}

export default UserController;