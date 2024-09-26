import {Product} from '../model/productModel.js'
import { Op } from 'sequelize';


export const getProductReport = async (req, res) => {
  const { campaignName, adGroupId, fsnId, productName } = req.body;

  try {
    const product = await Product.findOne({
      where: { campaignName, adGroupId, fsnId, productName }
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const CTR = (product.clicks / product.views) * 100;
    const totalRevenue = product.directRevenue + product.indirectRevenue;
    const totalOrders = product.directUnits + product.indirectUnits;
    const ROAS = totalRevenue / product.adSpend;

    res.status(200).json({
      adSpend: product.adSpend,
      views: product.views,
      clicks: product.clicks,
      CTR: CTR.toFixed(2),
      totalRevenue,
      totalOrders,
      ROAS: ROAS.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching report', error: err.message });
  }
};

export const getProductList=async(req,res)=>{
    try {
       const {campaignName,productName,page = 1, rowsPerPage = 5}  = req.body

       const filters = {};
       if (campaignName) {
        filters.campaignName ={
          [Op.like]: `%${campaignName}%`,
        };
      }
      if (productName) {
        filters.productName = {
          [Op.like]: `%${productName}%`,
        };
      }
       const limit = parseInt(rowsPerPage, 10); 
       const offset = (parseInt(page, 10) - 1) * limit;
       const products = await Product.findAndCountAll({
         where: filters,
         limit,
         offset,
         order: [['id', 'DESC']]
       });
       res.status(200).json({
         totalRecords: products.count,
         currentPage: page,
         totalPages: Math.ceil(products.count / limit),
         products: products.rows,
       });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products list ', error: err.message });
    }
}


// Retrieve product statistics filtered by Campaign Name
export const getReportByCampaign = async (req, res) => {
  const { campaignName, adGroupId, fsnId, productName } = req.body;

  try {
    const whereCondition = { campaignName };
    if (adGroupId){
      whereCondition.adGroupId = adGroupId;
    } 
    if (fsnId){
      whereCondition.fsnId = fsnId;
    }
    if (productName){
      whereCondition.productName = productName;
    }
    const product = await Product.findOne({ where: whereCondition });

    if (!product){
      return res.status(404).json({ message: 'Product not found in campaign name' });
    } else{
      const statistics  = calculateStatics(product)
      res.status(200).json({
        data: [responseData('campaignName', product, statistics)],
        status_code: 200,
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching report in campaign name', error: err.message });
  }
};

// API 2: Report by Ad Group ID with optional filters
export const getReportByAdGroup = async (req, res) => {
  const { adGroupId, campaignName, fsnId, productName } = req.body;

  try {
    const whereCondition = { adGroupId };
    if (campaignName){
      whereCondition.campaignName = campaignName;
    }
    if (fsnId){
      whereCondition.fsnId = fsnId;
    } 
    if (productName){
      whereCondition.productName = productName;
    } 
    const product = await Product.findOne({ where: whereCondition });

    if (!product){
      return res.status(404).json({ message: 'Product not found in group id' });
    } else{
     
      const statistics  = calculateStatics(product)
      res.status(200).json({
        data: [responseData('adGroupId', product, statistics)],
        status_code: 200,
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching report in group id', error: err.message });
  }
};

// API 3: Report by FSN ID with optional filters
export const getReportByFSN = async (req, res) => {
  const { fsnId, campaignName, adGroupId, productName } = req.body;

  try {
    const whereCondition = { fsnId };
    if (campaignName){
      whereCondition.campaignName = campaignName;
    } 
    if (adGroupId){
      whereCondition.adGroupId = adGroupId;
    } 
    if (productName){
      whereCondition.productName = productName;
    }

    const product = await Product.findOne({ where: whereCondition });

    if (!product){
      return res.status(404).json({ message: 'Product not found in fsn' });
    } else{
      
      const statistics  = calculateStatics(product)
      res.status(200).json({
        data: [responseData('fsnId', product, statistics)],
        status_code: 200,
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching report  in fsn', error: err.message });
  }
};

// API 4: Report by Product Name with optional filters
export const getReportByProductName = async (req, res) => {
  const { productName, campaignName, adGroupId, fsnId } = req.body;

  try {
    const whereCondition = { productName };
    if (campaignName){
      whereCondition.campaignName = campaignName;
    } 
    if (adGroupId){
      whereCondition.adGroupId = adGroupId;
    } 
    if (fsnId){
      whereCondition.fsnId = fsnId;
    }
    const product = await Product.findOne({ where: whereCondition });

    if (!product){
      return res.status(404).json({ message: 'Product not found in product name' });
    } else{
      const statistics  = calculateStatics(product)
      res.status(200).json({
        data: [responseData('productName', product, statistics)],
        status_code: 200,
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching report in product name', error: err.message });
  }
};
//response data
const responseData = (key, product, metrics) => {
  return {
    [key]: product[key],
    AdSpend: product.ad_spend,
    Views: product.views,
    Clicks: product.clicks,
    CTR: metrics.CTR,
    TotalRevenue: metrics.totalRevenue,
    TotalOrders: metrics.totalOrders,
    ROAS: metrics.ROAS,
  };
};
//calculation
const calculateStatics = (product) => {
  const CTR = (product.clicks / product.views) * 100;
  const totalRevenue = product.directRevenue + product.indirectRevenue;
  const totalOrders = product.directUnits + product.indirectUnits;
  const ROAS = totalRevenue / product.adSpend;

  return {
      CTR: !isNaN ?CTR.toFixed(2):0,
      totalRevenue,
      totalOrders,
      ROAS:!isNaN ? ROAS.toFixed(2):0
  };
};