import express from 'express';
import {getProductList, getProductReport} from '../controller/productController.js'
import {authMiddleware} from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/products/report', authMiddleware, getProductReport);
router.post('/products/product-list', authMiddleware, getProductList);

export default router;
