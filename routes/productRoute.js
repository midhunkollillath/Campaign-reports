import express from 'express';
import {getProductList, getProductReport, getReportByAdGroup, getReportByCampaign, getReportByFSN, getReportByProductName} from '../controller/productController.js'
import {authMiddleware} from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/products/report', authMiddleware, getProductReport);
router.post('/products/product-list', authMiddleware, getProductList);
router.post('/products/report/campaign',authMiddleware, getReportByCampaign);
router.post('/products/report/adGroupID',authMiddleware, getReportByAdGroup);
router.post('/products/report/fsnID',authMiddleware, getReportByFSN);
router.post('/products/report/productName',authMiddleware, getReportByProductName);

export default router;
