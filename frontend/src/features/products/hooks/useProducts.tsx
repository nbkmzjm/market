import { useEffect, useState, useReducer } from 'react';
import { UserContext } from '../../../contexts/UserProvider';
import logger from 'use-reducer-logger';
import ProductAPI from '../services/ProductsAPI';
import { ProductType } from '../../../models/model';
import useUser from '../../authen/hooks/useUser';

export default function useProducts() {
   const [products, setProducts] = useState<ProductType[]>([]);

   const { user } = useUser();
   console.log('user', user);
   const {
      fetchProducts_GrouppedByProductId,
      fetchProductsBySupplierId,
      fetchProductBySupplierId_Slug,
      loading,
      error,
   } = ProductAPI();

   const fetchProducts_GrouppedByProductIdHook = async () => {
      const returnProducts = await fetchProducts_GrouppedByProductId();
      setProducts(returnProducts);
   };

   const fetchProductsBySupplierIdHook = async (supplierId: string) => {
      const returnProducts = await fetchProductsBySupplierId(supplierId);
      setProducts(returnProducts);
   };
   useEffect(() => {
      if (user) {
         console.log('user exist');
         fetchProductsBySupplierIdHook(user.account.defaultSupplier.id);
      } else {
         fetchProducts_GrouppedByProductIdHook();
      }
   }, []);

   return { products, loading, error };
}
