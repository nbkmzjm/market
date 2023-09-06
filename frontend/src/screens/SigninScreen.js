import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
// import Axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function SigninScreen() {
  const navigate = useNavigate();

  const { search } = useLocation();
  console.log('use location:' + search);
  const redirectinUrl = new URLSearchParams(search).get('redirect');
  console.log('redirectinUrl :' + redirectinUrl);
  const redirect = redirectinUrl ? redirectinUrl : '/';
  console.log('redirect :' + redirect);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  console.log(auth.currentUser);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log(auth.currentUser);

        const userInfo = await getDoc(
          doc(db, 'users', userCredential.user.uid)
        );
        if (userInfo.exists()) {
          const currentUser = userInfo.data();
          const accountRef = doc(db, 'accounts', currentUser.account.accountId);
          const accountData = await getDoc(accountRef);
          const user = {
            ...userCredential.user,
            ...currentUser,
            account: { ...currentUser.account, ...accountData.data() },
          };
          console.log(user);
          ctxDispatch({
            type: 'USER_SIGNIN',
            payload: user,
          });
          localStorage.setItem('userInfo', JSON.stringify(user));
          console.log(userCredential);
          navigate(redirect || '/');
        }
      })
      .catch((err) => {
        // toast.error(getError(err));
        console.log(err);
      });
  };

  //    try {
  //       const { data } = await axios.post('/api/users/signin', {
  //          email,
  //          password,
  //       });
  //       console.log(data);

  //       ctxDispatch({ type: 'USER_SIGNIN', payload: data });
  //       localStorage.setItem('userInfo', JSON.stringify(data));
  //       navigate(redirect || '/');
  //    } catch (err) {
  //       toast.error(getError(err));
  //    }
  // };

  // useEffect(() => {
  //    if (userInfo) {
  //       navigate(redirect);
  //    }
  // }, [navigate, redirect, userInfo]);

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
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
