import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.header("authorization") || "";
  const [, token] = auth.split(" "); // "Bearer <token>"
  console.log(token);
  if (!token)
    return res.status(401).json({
      code: "NO_TOKEN",
      message: "Authorization: Bearer <token> required",
    });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
    };
    (req as any).user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res
      .status(401)
      .json({ code: "BAD_TOKEN", message: "Invalid or expired token" });
  }
}
