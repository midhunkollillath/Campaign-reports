import fs from "fs"
import { fileURLToPath } from 'url';
import path from 'path';
import csv from 'csv-parser';
import { Product } from '../model/productModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const uploadCSV = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'Please upload a CSV file' });
    // Check file extension
    const fileExtension = path.extname(file.originalname);
    if (fileExtension !== '.csv') {
      return res.status(400).json({ message: 'Only CSV files are allowed' });
    }
    const products = [];
  
    fs.createReadStream(path.join(__dirname, '../uploads', file.filename))
      .pipe(csv())
      .on('data', (row) => {
        const data = {
            campaignName: row['Campaign Name'],
            adGroupId: row['Ad Group ID'],
            fsnId: row['FSN ID'],
            productName: row['Product Name'],
            adSpend: parseFloat(row['Ad Spend']),
            views: parseInt(row['Views']),
            clicks: parseInt(row['Clicks']),
            directRevenue: parseFloat(row['Direct Revenue']),
            indirectRevenue: parseFloat(row['Indirect Revenue']),
            directUnits: parseInt(row['Direct Units']),
            indirectUnits: parseInt(row['Indirect Units'])
          };
        products.push(data);
      })
      .on('end', async () => {
        try {
          await Product.bulkCreate(products);
          res.status(201).json({ message: 'CSV uploaded and data saved to database' });
        } catch (err) {
          res.status(500).json({ message: 'Error saving data', error: err.message });
        }
      });
};
