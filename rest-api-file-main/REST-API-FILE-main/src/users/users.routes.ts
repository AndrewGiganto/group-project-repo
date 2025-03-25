import express, { Request, Response } from "express";
import { UnitUser, User } from "./user.interface";
import { StatusCodes } from "http-status-codes";
import * as database from "./user.database";

export const userRouter = express.Router();

// Register a new user
userRouter.post("/register", async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Please provide all the required parameters..." });
        }

        const existingUser = await database.findByEmail(email);
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "This email has already been registered..." });
        }

        const newUser = await database.create(req.body);
        return res.status(StatusCodes.CREATED).json({ newUser });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
});
// Delete a user
userRouter.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const user = await database.findOne(req.params.id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User does not exist" });
        }

        await database.remove(req.params.id);
        return res.status(StatusCodes.OK).json({ msg: "User deleted" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
});
