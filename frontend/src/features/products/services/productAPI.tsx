import React, { useState } from 'react';
import { Product } from '../../../models/model';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default function useFetchProduct() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const fetchProduct = async (productId: string): Promise<Product | null> => {
      try {
         setLoading(true);
         const ref = doc(db, 'product', productId);
         const data = await getDoc(ref);

         if (data.exists()) {
            const product: Product = {
               id: data.id,
               note: data.data().Note,
               brand: data.data().brand,
               category: data.data().category,
               cost: data.data().cost,
               countInStock: data.data().cost,
               description: data.data().description,
               image: data.data().image,
               name: data.data().name,
               price: data.data().price,
               quantity: data.data().quantity,
               ratings: data.data().ratings,
               size: data.data().size,
               slug: data.data().slug,
               unit: data.data().unit,
               max: data.data().max,
               min: data.data().min,
               accountId: data.data().accountId,
               productId: data.data().productId,
            };
            setLoading(false);

            return product;
         } else {
            setLoading(false);
            return null;
         }
      } catch (err) {
         setError(err as Error);
         setLoading(false);
         throw err;
      }
   };

   return { fetchProduct, loading, error };
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
