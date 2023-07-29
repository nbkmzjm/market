import { useSelector } from 'react-redux';
import NewProductForm from './NewProduct/NewProductForm';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import Rating from './Rating';
import { useContext } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import Badge from 'react-bootstrap/esm/Badge';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';

// const Product = () => {
//    const category = useSelector((state) => state.category);
//    //    const [category, setCategory] = useState("initial");
//    //    const onSelectCategogy = (selectedItem) => {
//    //       console.log("Product.Js:");
//    //       console.log(selectedItem);
//    //       setCategory(selectedItem);
//    //    };

//    return (
//       <div>
//          <NewProductForm />
//          <h1>{category}</h1>
//       </div>
//    );
// };

// export default Product;

export default function Product(props) {
   const { product } = props;
   const navigate = useNavigate();

   console.log('product:' + product);

   const { state, dispatch: ctxDispatch } = useContext(Store);
   const { cart } = state;

   // const addToCardHandler = async (item) => {
   //    const existItem = cart.cartItems.find((x) => x._id === product._id);

   //    const quantity = existItem ? existItem.quantity + 1 : 1;
   //    const { data } = await axios.get(`/api/products/${item._id}`);
   //    if (data.countInStock < quantity) {
   //       window.alert('Sorry. Product is out of stock');
   //       return;
   //    }

   //    ctxDispatch({
   //       type: 'CARD_ADD_ITEM',
   //       payload: { ...product, quantity: quantity },
   //    });
   // };

   const addToCardHandler = async () => {
      console.log('cart');
      console.log(product);
      const existItem = cart.cartItems.find((x) => x.id === product.id);

      const quantity = existItem ? existItem.quantity + 1 : 1;
      const productRef = doc(db, 'product', product.id);
      // const { data } = await axios.get(`/api/products/${product._id}`);
      console.log(product);
      const docSnap = await getDoc(productRef);
      if (docSnap.exists()) {
         if (docSnap.data().countInStock < quantity) {
            toast('Sorry. Product is out of stock');
            return;
         }
      } else {
         toast.error('No such document');
      }

      ctxDispatch({
         type: 'CARD_ADD_ITEM',
         payload: { ...product, quantity: quantity },
      });
      navigate('/cart');
   };

   return (
      <Card>
         <Link to={`/product/${product.slug}`}>
            <img
               src={product.image}
               className="card-img-top"
               alt={product.name}
            />
         </Link>

         <Card.Body>
            <Link to={`/product/${product.slug}`}>
               <Card.Title>{product.name}</Card.Title>
            </Link>
            <Rating
               rating={product.rating}
               numReviews={product.numReviews}
            ></Rating>
            <Card.Text>${product.price}</Card.Text>
            {product.countInStock > 0 ? (
               <Button onClick={() => addToCardHandler(product)}>
                  Add Cart
               </Button>
            ) : (
               <Badge bg="danger">Out Of Stock</Badge>
            )}
         </Card.Body>
      </Card>
   );
}
