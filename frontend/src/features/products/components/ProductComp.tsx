import React, { ReactElement } from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Rating from './Rating';
import { ProductType } from '../../../models/model';
import useCart from '../../../contexts/CartProvider';
import useUser from '../../authen/hooks/useUser';
import { toast } from 'react-toastify';

type PropsType = {
   product: ProductType;
};

export default function ProductComp({ product }: PropsType): ReactElement {
   const navigate = useNavigate();
   const {
      dispatch: cartDispatch,
      REDUCER_ACTIONS: CART_ACTIONS,
      cartItems,
   } = useCart();

   const { user } = useUser();
   console.log(cartItems);
   const addToCardHandler = async () => {
      console.log('adding to cart');
      console.log(product);
      console.log('user', user);
      if (user) {
         cartDispatch({
            type: CART_ACTIONS.ADD_CART_ITEM,
            payload: {
               product: { ...product, quantity: 1 },
               accountId: user.account.accountId,
            },
         });
      } else {
         toast.error('Please sign in to add to cart');

         navigate('/signin');
      }

      // const q = query(
      //    collection(
      //       db,
      //       'accounts',
      //       state.userInfo.account.defaultSupplier.id,
      //       'accountProducts'
      //    ),
      //    where('productId', '==', product.productId)
      // );

      // const docSnap = await getDocs(q);
      // console.log(state.userInfo.account.accountId);
      // console.log(docSnap);

      // if (docSnap.size === 1) {
      //    if (docSnap.docs[0].data().countInStock < quantity) {
      //       toast('Sorry. Product is out of stock');
      //       return;
      //    }
      // } else {
      //    toast.error('Number of document retuned is incorrect');
      // }

      // cartDispatch({
      //    type: CART_ACTIONS.ADD_CART_ITEM,
      //    payload: { ...product, quantity: quantity },
      // });

      // navigate('/cart');
   };

   const content = (
      <Card>
         <Link to={`/product/${product.slug}~${product.accountId}`}>
            <img
               src={product.image}
               className="card-img-top"
               alt={product.name}
            />
         </Link>

         <Card.Body>
            <Link to={`/product/${product.slug}~${product.accountId}`}>
               <Card.Title>{product.name}</Card.Title>
            </Link>
            <Rating
               rating={product.rating}
               numReviews={product.numReviews}
            ></Rating>
            <select>
               <option value="">Select a vendor</option>
               <option value="">Select a vendor</option>
               {console.log('product.price', product.price)}
               {product.price.map((price, index) => (
                  <option key={index} value={price}>
                     {price}
                  </option>
               ))}
            </select>
            <Card.Text>${product.price}</Card.Text>
            <Button onClick={() => addToCardHandler(product)}>Add Cart</Button>
            {/* {product.countInStock > 0 ? (
               <Button onClick={() => addToCardHandler(product)}>
                  Add Cart
               </Button>
            ) : (
               <Badge bg="danger">Out Of Stock</Badge>
            )} */}
         </Card.Body>
      </Card>
   );
   return content;
}
