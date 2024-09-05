import express from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { authenticateUser, authorizeRoles } from '../middlewares/authMiddleware.js';


const productRouter=express.Router();

productRouter.route('/')
.get(getProducts)
.post(authenticateUser, authorizeRoles("admin"), createProduct)

productRouter.route('/:id')
.put(authenticateUser, authorizeRoles("admin"), updateProduct)
.delete(authenticateUser, authorizeRoles("admin"), deleteProduct)

export default productRouter;