import bcrypt from 'bcryptjs';
const data = {
   users: [
      {
         name: 'Thien',
         email: 'admin@mkPlace.com',
         password: bcrypt.hashSync('12345'),
         role: 'Admin',
      },

      {
         name: 'Thao',
         email: 'thao@mkPlace.com',
         password: bcrypt.hashSync('12345'),
         role: 'buyer',
      },
   ],
   products: [
      {
         // _id: '1',
         name: 'Artisan GelEfex Gel Nail Polish',
         slug: 'Artisan-GelEfex-Gel-Nail-Polish',
         price: 10,
         cost: 7,
         brand: 'Artisan',
         category: 'Gel',
         size: 0.5,
         unit: 'oz',
         image: 'https://m.media-amazon.com/images/I/B1DBWbloIpS._CLa%7C2140%2C2000%7C91y%2B4ymrM4L.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UL1500_.png',
         countInStock: 10,
         rating: 1,
         description:
            'Extra thick gel doesn’t mean durable, sometimes it just means messy. Good thing this brush on gel is neither',
         Note: 'new item',
      },
      {
         // _id: '2',
         name: 'Artisan Colored Acrylic Nail Powder | Professional Size - Green',
         slug: 'Artisan-Colored-Acrylic-Nail-Powder-Professional-Size-Green',
         price: 10,
         cost: 6,
         brand: 'Artisan',
         category: 'Acrylic',
         size: 0.44,
         unit: 'oz',
         image: 'https://i5.walmartimages.com/asr/0ec1b72b-a123-48ff-bf98-6da928961de7.18a7b7de3003eeecd8db166e91532cae.jpeg',
         countInStock: 0,
         rating: 2.5,
         description:
            ' It will wear wonderfully for summer and spring inspired 3D nail art designs and nail enhancements',
         Note: 'new item',
      },
      {
         // _id: '3',
         name: 'Glow in Dark Nail Pigment Powder | Pack #1',
         slug: 'Glow-in-Dark-Nail-Pigment-Powder-Pack-1',
         price: 12,
         cost: 4,
         brand: 'TNS',
         category: 'Color Dipping Power',
         size: 12,
         unit: 'tray',
         image: 'https://m.media-amazon.com/images/I/B1pDnrUmaHS._CLa%7C2140%2C2000%7C91qSQl4VrZL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UL1500_.png',
         countInStock: 10,
         rating: 3,
         description:
            'Show up to shine with a set of 12 glow-in-the-dark color powder',
         Note: 'new item',
      },
   ],
};
export default data;
