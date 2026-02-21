import jwt from "jsonwebtoken";
const { sign, verify } = jwt;

const secret: any = process.env["SECRET_KEY"];

async function createToken(payload: object, options: object): Promise<string> {
    return new Promise((resolve, reject) => {
        sign(payload, secret, options, function(err: any, token: any) {
            if (err) return reject(err);

            return resolve(token);
        });
    });
}

async function verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        verify(token, secret, (err: any, decoded: any) => {
            if (err) reject(err);

            resolve(decoded);
        });
    });
}

export { createToken, verifyToken };