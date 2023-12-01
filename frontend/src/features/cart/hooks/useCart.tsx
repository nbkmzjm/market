import { useContext } from 'react';
import { CartContext, UseContextType } from '../../../contexts/CartProvider';

export default function useCart(): UseContextType {
   return useContext(CartContext);
}
