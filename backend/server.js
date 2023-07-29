import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config();

mongoose
   .connect(process.env.MONGODB_URI)
   .then(() => {
      console.log('connected to MongoDB');
   })
   .catch((error) => {
      console.log('DB is not connected due to: ');
      console.log(error);
   });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

// app.get('/api/products', (req, res) => {
//    res.send(data.products);
// });
app.use((err, req, res, next) => {
   res.status(500).send({ message: err.message });
});
const port = process.env.PORT || 5000;

app.listen(port, () => {
   console.log(`server at http://localhost:${port}`);
});
