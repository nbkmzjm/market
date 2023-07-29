const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
   orderId: {
      type: String,
      required: true,
      unique: true,
   },
   customerName: {
      type: String,
      required: true,
   },
   shippingAddress: {
      fullName: {
         type: String,
         required: true,
      },
      address: {
         type: String,
         required: true,
      },
      city: {
         type: String,
         required: true,
      },
      postalCode: {
         type: String,
         required: true,
      },
      country: {
         type: String,
         required: true,
      },
   },
   paymentMethod: { type: String, required: true },
   date: {
      type: Date,
      default: Date.now,
   },
   items: [
      {
         name: {
            type: String,
            required: true,
         },
         slug: {
            type: String,
            required: true,
         },
         quantity: {
            type: Number,
            required: true,
            min: 1,
         },
         image: {
            type: String,
            required: true,
         },
         price: {
            type: Number,
            required: true,
            min: 0,
         },
         product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
         },
      },
   ],
   totalAmount: {
      type: Number,
      required: true,
   },
   // Additional fields can be added based on your specific requirements
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
