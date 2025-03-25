import express, { Request, Response } from "express";
import { Product, UnitProduct } from "./product.interface";
import * as database from "./product.database";
import { StatusCodes } from "http-status-codes";

export const productRouter = express.Router();

// Create a new product
productRouter.post("/product", async (req: Request, res: Response) => {
    try {
        const { name, price, quantity, image } = req.body;
        if (!name || !price || !quantity || !image) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Please provide all the required parameters." });
        }
        const newProduct = await database.create({ ...req.body });
        return res.status(StatusCodes.CREATED).json({ newProduct });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
});
// Delete a product
productRouter.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const getProduct = await database.findOne(req.params.id);
        if (!getProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: `No product with ID ${req.params.id}` });
        }

        await database.remove(req.params.id);
        return res.status(StatusCodes.OK).json({ msg: "Product deleted" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
});