import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev-only";

export const signToken = (payload: any, expiresIn: string | number = "1d") => {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn: expiresIn as any });
};

export const verifyToken = <T>(token: string): T | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as T;
    } catch (error) {
        return null;
    }
};
