import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

export default function SigninScreen() {
   const navigate = useNavigate();

   const { search } = useLocation();
   const redirectinUrl = new URLSearchParams(search).get('redirect');
   const redirect = redirectinUrl ? redirectinUrl : '/';

   const [name, setName] = useState();
   const [email, setEmail] = useState();
   const [password, setPassword] = useState();
   const [role, setRole] = useState('buyer');

   const { state, dispatch: ctxDispatch } = useContext(Store);
   const { userInfo } = state;
   const selectedHandler = (e) => {
      setRole(e.target.value);
   };

   const onSubmitHandler = async (e) => {
      e.preventDefault();

      await createUserWithEmailAndPassword(auth, email, password)
         .then(async (userCredential) => {
            userCredential.user.displayName = name;
            const userRef = doc(db, 'users', userCredential.user.uid);

            const userDetail = { address: '', role: role };

            await setDoc(userRef, userDetail).then(async () => {
               const userInfo = await getDoc(
                  doc(db, 'users', userCredential.user.uid)
               );
               if (userInfo.exists()) {
                  console.log(userInfo.data());
                  const user = {
                     ...userCredential.user,
                     ...userInfo.data(),
                  };
                  console.log(user);
                  ctxDispatch({
                     type: 'USER_SIGNIN',
                     payload: user,
                  });
                  localStorage.setItem('userInfo', JSON.stringify(user));
                  console.log(userCredential);
                  navigate('/signin');
               }
            });
         })
         .catch((err) => {
            toast.error(getError(err));
         });
      // console.log('pass:' + password);
      // try {
      //    const { data } = await Axios.post('/api/users/signup', {
      //       name,
      //       email,
      //       password,
      //    });
      //    console.log(data);

      // ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      // localStorage.setItem('userInfo', JSON.stringify(data));
      //    navigate('/signin');
      // } catch (err) {
      //    toast.error(getError(err));

      // }
   };

   useEffect(() => {
      console.log('checking user');
      const userExisted = async () => {
         const querySnap = await getDocs(collection(db, 'users'));
         if (querySnap.empty) {
            setRole('admin');

            const element = document.getElementById('role');
            if (element) {
               console.log(element);
               const newOption = document.createElement('option');
               newOption.value = 'admin';
               newOption.textContent = 'Admin';
               element.appendChild(newOption);
            }
         } else {
            console.log('exist user');
         }
      };
      userExisted();
      if (userInfo) {
         navigate(redirect);
      }
   }, [navigate, redirect, userInfo]);

   return (
      <Container className="small-container">
         <Helmet>
            <title>Sign Up</title>
         </Helmet>
         <h1 className="my-3">Sign Up</h1>
         <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="name">
               <Form.Label>Name</Form.Label>
               <Form.Control
                  type="name"
                  required
                  onChange={(e) => setName(e.target.value)}
               ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
               <Form.Label>Email</Form.Label>
               <Form.Control
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
               ></Form.Control>
            </Form.Group>
            <Form.Group controlId="role" onChange={selectedHandler}>
               <Form.Label>Select a role:</Form.Label>
               <Form.Select>
                  <option value="buyer">Buyer</option>
                  <option value="supplier">Supplier</option>
                  <option value="admin">Admin</option>
               </Form.Select>
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
               <Button type="submit"> Sign Up</Button>
            </div>
            <div className="mb-3">
               Log In to account isntead!
               <Link to={'/signin'}>Log-In</Link>
            </div>
         </Form>
      </Container>
   );
}
