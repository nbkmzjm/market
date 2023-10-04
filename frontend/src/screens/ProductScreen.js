import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useReducer, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import Rating from '../Product/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import { Store } from '../Store';
import {
  getDocs,
  collection,
  where,
  query,
  doc,
  getDoc,
  setDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';
import { getError } from '../functions/utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, product: [] };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, product: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
  }
};

export default function ProdcutScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, cart } = state;
  console.log(slug);
  console.log('cart:', cart);
  const slugArray = slug.split('~');
  const accountId = state.userInfo.account.accountId;
  const productSlug = slugArray[0];
  const supplierAccountId = slugArray[1];
  console.log('supplierId:', supplierAccountId);

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    console.log('effect run');
    const fetchData = async () => {
      console.log(slugArray[1]);
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        // const result = await axios.get(`/api/products/slug/${slug}`);

        const q = query(
          collection(db, 'accounts', supplierAccountId, 'accountProducts'),
          where('slug', '==', productSlug)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 1) {
          const result = querySnapshot.docs[0].data();

          console.log(querySnapshot.docs[0].id);
          dispatch({ type: 'FETCH_SUCCESS', payload: result });
        } else {
          console.log('no product found');
          throw new Error('No product found');
        }
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [slug]);

  // useEffect(() => {
  //    const fetchCartData = async () => {
  //       const cartData = [];
  //       const cartRef = collection(
  //          db,
  //          'accounts',
  //          userInfo.account.accountId,
  //          'cart'
  //       );
  //       const snapshot = await getDocs(cartRef);
  //       console.log(snapshot);
  //       if (snapshot.docs.length > 0) {
  //          snapshot.forEach((doc) => {
  //             cartData.push({ ...doc.data() });
  //          });
  //          setCart(cartData);
  //       } else {
  //          console.log('no item in card found');
  //       }
  //    };
  //    fetchCartData();
  // }, []);

  const addToCardHandler = async () => {
    console.log('cart');
    console.log(product);
    console.log(accountId);

    const existItem = cart.cartItems.find(
      (x) => x.productId === product.productId
    );
    console.log('existItem', existItem);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    console.log('userInfo', userInfo);
    const q = query(
      collection(db, 'accounts', supplierAccountId, 'accountProducts'),
      where('productId', '==', product.productId)
    );
    const docSnap = await getDocs(q);

    if (docSnap.size === 1) {
      if (docSnap.docs[0].data().countInStock < quantity) {
        toast('Sorry. Product is out of stock');
        return;
      }
    } else {
      toast.error('Number of document retuned is incorrect');
    }

    ctxDispatch({
      type: 'CARD_ADD_ITEM',
      payload: { ...product, quantity: quantity },
    });

    navigate('/cart');
  };

  return (
    <div>
      {console.log('render')}
      {console.log(product.name)}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger"> {error}</MessageBox>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
              />
            </Col>

            <Col md={3}>
              {console.log(product, 'render')}
              <ListGroup varirant="flush">
                <ListGroup.Item>
                  <Helmet>
                    {console.log('product name: ', product.name)}
                    <title>{product.name}</title>
                  </Helmet>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                </ListGroup.Item>
                <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>${product.price}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0 ? (
                            <Badge bg="success">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Out Of Stock</Badge>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      {product.countInStock > 0 && (
                        <div className="d-grid">
                          <Button onClick={addToCardHandler} variant="primary">
                            Add to Card
                          </Button>
                        </div>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}
      ;
    </div>
  );
}
