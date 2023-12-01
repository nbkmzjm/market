import React, { useState, useEffect } from 'react';
import { ProductType, User } from '../../../models/model';
import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import useUser from '../../authen/hooks/useUser';

export default function ProductAPI() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   //Fetch all products by default supplierId
   const fetchProductsBySupplierId = async (
      supplierId: string
   ): Promise<ProductType[] | []> => {
      setLoading(true);
      try {
         const supplierProdcutSnap = await getDocs(
            collection(db, 'accounts', supplierId, 'accountProducts')
         );
         if (supplierProdcutSnap.size > 0) {
            const productArray: ProductType[] = supplierProdcutSnap.docs.map(
               (doc) => doc.data() as ProductType
            );
            setLoading(false);
            return productArray;
         } else {
            setLoading(false);
            throw new Error('Can not find products for this supplier Id');
         }
      } catch (error) {
         setLoading(false);
         setError(error as Error);
      }

      return [];
   };

   const fetchProductBySupplierId_Slug = async (
      supplierAccountId: string,
      slug: string
   ): Promise<ProductType> => {
      try {
         // const result = await axios.get(`/api/products/slug/${slug}`);

         const q = query(
            collection(db, 'accounts', supplierAccountId, 'accountProducts'),
            where('slug', '==', slug)
         );
         const querySnapshot = await getDocs(q);
         console.log(querySnapshot.docs[0]);

         if (querySnapshot.size === 1) {
            const product = {
               ...querySnapshot.docs[0].data(),
               id: querySnapshot.docs[0].id,
            } as ProductType;
            console.log(product);
            return product;
         } else if (querySnapshot.size === 0) {
            // Handle the case where no product is found
            throw new Error('No product found');
         } else {
            throw new Error('Multiple products found with the same slug');
         }
      } catch (error) {
         setError(error as Error);
         throw error;
      }
   };

   const fetchProducts_GrouppedByProductId = async (): Promise<
      ProductType[]
   > => {
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
               const product = doc.data() as ProductType;

               // const product: ProductType = {
               //    id: doc.id,
               //    note: doc.data().Note,
               //    brand: doc.data().brand,
               //    category: doc.data().category,
               //    cost: doc.data().cost,
               //    countInStock: doc.data().cost,
               //    description: doc.data().description,
               //    image: doc.data().image,
               //    name: doc.data().name,
               //    price: doc.data().price,
               //    quantity: doc.data().quantity,
               //    ratings: doc.data().ratings,
               //    size: doc.data().size,
               //    slug: doc.data().slug,
               //    unit: doc.data().unit,
               //    max: doc.data().max,
               //    min: doc.data().min,
               //    accountId: doc.data().accountId,
               //    productId: doc.data().productId,
               // };

               allProducts.push(product);
            });
         }
         console.log('allProducts', allProducts);
         //combine all products from different suppliers and put price, accountId, stock and
         //cost in an array to display as multi vendor options
         type GroupedProductType = {
            [productId: string]: ProductType[];
         };
         // const combinedProducts: GroupedProductType = allProducts.reduce(
         //    (acc, currentProduct) => {
         //       const key: string = currentProduct.productId;

         //       if (!acc[key]) {
         //          acc[key] = [];
         //       }

         //       acc[key].push(currentProduct);
         //       return acc;
         //    }
         // );

         // const combinedProducts = allProducts.reduce(
         //    (
         //       acc: CombinedProductType[],
         //       currentProduct: CombinedProductType
         //    ) => {
         //       const existingProduct = acc.find(
         //          (product: CombinedProductType) =>
         //             product.productId === currentProduct.productId
         //       );
         //       console.log('existingProduct', existingProduct);
         //       if (existingProduct) {
         //          // priceArray.push(existingProduct.price, currentProduct.price);
         //          console.log('price before', existingProduct.price);
         //          existingProduct.price = [
         //             ...existingProduct.price,
         //             {
         //                id: currentProduct.accountId,
         //                price: currentProduct.price[0].price,
         //             },
         //          ];
         //          console.log('price after', existingProduct.price);
         //       } else {
         //          acc.push({
         //             ...currentProduct,
         //             price: [
         //                {
         //                   id: currentProduct.accountId,
         //                   price: currentProduct.price[0].price,
         //                },
         //             ],
         //          });
         //          console.log('acc', acc);
         //       }

         //       return acc;
         //    },
         //    []
         // );
         if (allProducts.length > 0) {
            setLoading(false);
            return allProducts;
         } else {
            throw new Error('Cannot find products');
         }
      } catch (err) {
         setError(err as Error);

         throw err;
      }
   };

   return {
      fetchProducts_GrouppedByProductId,
      fetchProductsBySupplierId,
      fetchProductBySupplierId_Slug,
      loading,
      error,
   };
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
