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
