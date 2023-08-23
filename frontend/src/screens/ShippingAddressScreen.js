import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckOutSteps from '../components/CheckOutSteps';

export default function ShipAddressScreen(second) {
   const navigate = useNavigate();
   const { state, dispatch: ctxDispatch } = useContext(Store);

   const {
      cart: { shippingAddress },
      userInfo,
   } = state;
   const [fullName, setFullName] = useState(shippingAddress.fullName || '');
   const [address, setAddress] = useState(shippingAddress.address || '');
   const [city, setCity] = useState(shippingAddress.city || '');
   const [stateAdd, setStateAdd] = useState(shippingAddress.stateAdd || '');
   const [postalCode, setPostalCode] = useState(
      shippingAddress.postalCode || ''
   );
   const [country, setCountry] = useState(shippingAddress.country || '');

   useEffect(() => {
      if (!userInfo) {
         navigate('/signin?redirect=/shipping');
      }
   }, [userInfo, navigate]);

   const submitHandler = (e) => {
      e.preventDefault();
      console.log(fullName);
      ctxDispatch({
         type: 'SAVE_SHIPPING_ADDRESS',
         payload: {
            fullName,
            address,
            city,
            stateAdd,
            postalCode,
            country,
         },
      });
      navigate('/payment');
   };
   return (
      <div>
         <Helmet>
            <title>Shipping Address</title>
         </Helmet>
         <CheckOutSteps step1 step2></CheckOutSteps>
         <div className="container small-container">
            <h1 className="my-3">Shipping Adress </h1>

            <Form onSubmit={submitHandler}>
               <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     required
                  ></Form.Control>
               </Form.Group>
               <Form.Group>
                  <Form.Label>Address </Form.Label>
                  <Form.Control
                     value={address}
                     onChange={(e) => setAddress(e.target.value)}
                     required
                  ></Form.Control>
               </Form.Group>
               <Form.Group>
                  <Form.Label>City </Form.Label>
                  <Form.Control
                     value={city}
                     onChange={(e) => setCity(e.target.value)}
                     required
                  ></Form.Control>
               </Form.Group>
               <Form.Group>
                  <Form.Label>State </Form.Label>
                  <Form.Control
                     value={stateAdd}
                     onChange={(e) => setStateAdd(e.target.value)}
                     required
                  ></Form.Control>
               </Form.Group>
               <Form.Group>
                  <Form.Label>Postal Code </Form.Label>
                  <Form.Control
                     value={postalCode}
                     onChange={(e) => setPostalCode(e.target.value)}
                     required
                  ></Form.Control>
               </Form.Group>
               <Form.Group>
                  <Form.Label>Country </Form.Label>
                  <Form.Control
                     value={country}
                     onChange={(e) => setCountry(e.target.value)}
                     required
                  ></Form.Control>
               </Form.Group>
               <div className="mt-3">
                  <Button varian="primary" type="submit">
                     Continue
                  </Button>
               </div>
            </Form>
         </div>
      </div>
   );
}
