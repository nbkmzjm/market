import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import CheckOutSteps from '../components/CheckOutSteps';

export default function PaymentScreen() {
   const navigate = useNavigate();

   const { state, dispatch: ctxDispatch } = useContext(Store);
   const {
      cart: { shippingAddress, paymentMethod },
   } = state;

   const [paymentMethodName, setPaymentMethod] = useState(
      paymentMethod || 'Paypal'
   );

   useEffect(() => {
      if (!shippingAddress.address) {
         navigate('/shipping');
      }
   }, [navigate, shippingAddress]);

   const onSubmitHandler = async (e) => {
      e.preventDefault();
      ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
      localStorage.setItem('paymentMethod', paymentMethodName);
      navigate('/orderSummary');
   };

   return (
      <div>
         <Helmet>
            <title>Payment Screen</title>
         </Helmet>
         <div>
            <CheckOutSteps step1 step2 step3></CheckOutSteps>
            <h1 className="my-3">Payment Method</h1>

            <div className="container small-containter">
               <div className="mt-3">
                  <Form onSubmit={onSubmitHandler}>
                     <Form.Check
                        type="radio"
                        id="Paypal"
                        label="Paypal"
                        value="Paypal"
                        checked={paymentMethodName === 'Paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                     ></Form.Check>

                     <Form.Check
                        type="radio"
                        id="Stripe"
                        label="Stripe"
                        value="Stripe"
                        checked={paymentMethodName === 'Stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                     />
                     <div className="mt-3">
                        <Button type="submit">Submit</Button>
                     </div>
                  </Form>
               </div>
            </div>
         </div>
      </div>
   );
}
