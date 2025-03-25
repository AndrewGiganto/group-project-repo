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
// Get all products

productRouter.get("/products", async (req: Request, res: Response) => {
    try {
        const allProducts = await database.findAll();
        if (allProducts.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "No products found!" });
        }
        return res.status(StatusCodes.OK).json({ total: allProducts.length, allProducts });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
});

// Get a single product by ID
productRouter.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const product = await database.findOne(req.params.id);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Product does not exist" });
        }
        return res.status(StatusCodes.OK).json({ product });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
});