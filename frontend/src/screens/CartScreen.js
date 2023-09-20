import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/esm/Card';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';

export default function CartSceen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;
  const supplierAccountId = userInfo.account.defaultSupplier.id;
  const updateCartHandler = async (item, quantity) => {
    // const { data } = await axios.get(`/api/products/${item._id}`);

    // const q = query(
    //    collection(db, 'accounts', ''),
    //    where('productId', '==', item.productId),
    //    where('supplierId', '==', userInfo.account.defaultSupplier.id)
    // );

    const q = query(
      collection(db, 'accounts', supplierAccountId, 'accountProducts'),
      where('productId', '==', item.productId)
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
      payload: { ...item, quantity: quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({
      type: 'CARD_REMOVE_ITEM',
      payload: item,
    });
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>

      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.productId}>
                  <Row className="align-items-center">
                    <Col md={1}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>
                      {''}
                    </Col>
                    <Col md={4}>
                      <Link to={`/product/${item.slug}~${item.accountId}`}>
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>
                      <span> {item.quantity}</span>
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={1}>${item.price}</Col>
                    <Col md={1}>
                      <Button
                        variant="light"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => checkoutHandler()}
                      disabled={cartItems.length === 0}
                    >
                      Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
