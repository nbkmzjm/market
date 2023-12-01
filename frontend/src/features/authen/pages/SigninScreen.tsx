import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
// import Axios from 'axios';
import { toast } from 'react-toastify';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../config/firebase';
import { getError } from '../../../functions/utils';
import useUser from '../hooks/useUser';
import UserAPI from '../services/UserAPI';

export default function SigninScreen() {
   const navigate = useNavigate();

   const { search } = useLocation();
   console.log('use location:' + search);
   const redirectinUrl = new URLSearchParams(search).get('redirect');
   console.log('redirectinUrl :' + redirectinUrl);
   const redirect = redirectinUrl ? redirectinUrl : '/';
   console.log('redirect :' + redirect);
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');

   console.log(auth.currentUser);
   const { fetchUser } = UserAPI();

   const {
      dispatch: userDispatch,
      REDUCER_ACTIONS: USER_ACTIONS,
      user,
   } = useUser();

   const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      await signInWithEmailAndPassword(auth, email, password)
         .then(async (userCredential) => {
            console.log(auth.currentUser);

            const user = await fetchUser(userCredential.user.uid);
            console.log(user);
            userDispatch({
               type: USER_ACTIONS.SIGN_IN,
               payload: user,
            });
            localStorage.setItem('userInfo', JSON.stringify(user));

            navigate(redirect || '/');
         })
         .catch((err) => {
            toast.error(getError(err));
            console.log(err);
         });
   };

   return (
      <Container className="small-container">
         <Helmet>
            <title>Sign In</title>
         </Helmet>
         <h1 className="my-3">Sign In</h1>
         <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="email">
               <Form.Label>Email</Form.Label>
               <Form.Control
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
               ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
               <Form.Label>Password</Form.Label>
               <Form.Control
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
               ></Form.Control>
            </Form.Group>

            <div className="mb-3">
               <Button type="submit"> Sign In</Button>
            </div>
            <div className="mb-3">
               New customer?
               <Link to={`/signup?redirect=${redirect}`}>
                  Create your account
               </Link>
            </div>
         </Form>
      </Container>
   );
}
