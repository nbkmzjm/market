import React, { useState, useEffect } from 'react';
import { ProductType } from '../../../models/model';
import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default function ProductAPI() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const fetchProducts = async () => {
      console.log('fetch all products');
      try {
         setLoading(true);
         const allProducts: ProductType[] = [];
         const q = query(
            collection(db, 'accounts'),
            where('accountType', '==', 'supplier')
         );

         const supplierAccountSnap = await getDocs(q);
         for (const supplierAccount of supplierAccountSnap.docs) {
            console.log(supplierAccount);
            const subCollectionRef = collection(
               db,
               'accounts',
               supplierAccount.id,
               'accountProducts'
            );
            const accountProductsSupplier = await getDocs(subCollectionRef);
            console.log('accountProductsSupplier', accountProductsSupplier);
            accountProductsSupplier.forEach((doc) => {
               console.log(doc.data());

               const product: ProductType = {
                  id: doc.id,
                  note: doc.data().Note,
                  brand: doc.data().brand,
                  category: doc.data().category,
                  cost: doc.data().cost,
                  countInStock: doc.data().cost,
                  description: doc.data().description,
                  image: doc.data().image,
                  name: doc.data().name,
                  price: [doc.data().price],
                  quantity: doc.data().quantity,
                  ratings: doc.data().ratings,
                  size: doc.data().size,
                  slug: doc.data().slug,
                  unit: doc.data().unit,
                  max: doc.data().max,
                  min: doc.data().min,
                  accountId: doc.data().accountId,
                  productId: doc.data().productId,
               };

               allProducts.push(product);
            });
         }
         //combine all products from different suppliers and put price, accountId, stock and
         //cost in an array to display as multi vendor options
         const combinedProducts = allProducts.reduce(
            (acc: ProductType[], currentProduct: ProductType) => {
               const existingProduct = acc.find(
                  (product: ProductType) =>
                     product.productId === currentProduct.productId
               );
               console.log('existingProduct', existingProduct);
               if (existingProduct) {
                  // priceArray.push(existingProduct.price, currentProduct.price);
                  console.log('price before', existingProduct.price);
                  existingProduct.price = [
                     ...existingProduct.price,
                     ...currentProduct.price,
                  ];
                  console.log('price after', existingProduct.price);
               } else {
                  acc.push({
                     ...currentProduct,
                     price: [...currentProduct.price],
                  });
               }

               return acc;
            },
            []
         );
         console.log('combinedProducts', combinedProducts);
         if (combinedProducts.length > 0) {
            setLoading(false);
            return combinedProducts;
         } else {
            throw new Error('Cannot find products');
         }
      } catch (err) {
         setError(err as Error);

         throw err;
      }
   };

   return { fetchProducts, loading, error };
}

// note: data.data().note,
// brand:
// category:
// cost:
// countInStock:
// description:
// id:
// image:
// name:
// price:
// quantity:
// ratings:
// size:
// slug:
// unit:
// max:
// min:
// accountId:
// productId:
