import express from 'express';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import data from '../data.js';

const seedRounter = express.Router();

seedRounter.get('/', async (req, res) => {
   await Product.remove({});
   const createdProducts = await Product.insertMany(data.products);

   await User.remove({});
   const createdUsers = await User.insertMany(data.users);
   res.send({ createdProducts, createdUsers });
});
export default seedRounter;
