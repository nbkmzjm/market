import { useEffect, useState, useReducer } from 'react';
import { UserContext } from '../../../contexts/UserProvider';
import logger from 'use-reducer-logger';
import ProductAPI from '../services/ProductsAPI';
import { ProductType } from '../../../models/model';

export default function useProducts() {
   const [products, setProducts] = useState<ProductType[]>([]);
   const { fetchProducts, loading, error } = ProductAPI();
   const fetchProductsHook = async () => {
      const returnProduct = await fetchProducts();
      setProducts(returnProduct);
   };
   useEffect(() => {
      fetchProductsHook();
   }, []);

   return { products, loading, error };
}
