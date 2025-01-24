import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB } from './utils/database.js';
import userRouter from './routers/user.router.js';
import { createError } from './utils/helper.js';
import productRouter from './routers/product.router.js';
import categoryRouter from './routers/category.router.js';

dotenv.config();

const app = express();

// Database connection
connectToDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Routers
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);

// Error handlers
app.use((req, res, next) => {
    next(createError("Route not found!", 404));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ msg: err.message });
});

export default app; // Export app for testing purposes
