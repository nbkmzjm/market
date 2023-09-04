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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';

export default function SigninScreen() {
  const navigate = useNavigate();

  const { search } = useLocation();
  const redirectinUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectinUrl ? redirectinUrl : '/';

  const [newUser, setNewUser] = useState({
    displayName: '',
    email: '',
    password: '',
    accountType: '',
  });
  console.log(newUser);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const [name, setName] = useState();
  // const [email, setEmail] = useState();
  // const [password, setPassword] = useState();
  // const [role, setRole] = useState('buyer');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
      .then(async (userCredential) => {
        console.log(userCredential.user.uid);
        const account = {
          businessName: '',
        };
        await addDoc(collection(db, 'accounts'), account).then(
          async (account) => {
            console.log(account.id);
            userCredential.user.displayName = newUser.displayName;
            const userRef = doc(db, 'users', userCredential.user.uid);

            const userDetail = {
              address: '',
              email: userCredential.user.email,
              displayName: userCredential.user.displayName,
              role: 'admin',
              account: {
                accountId: account.id,
                accountType: newUser.accountType,
                defaultSupplier: '',
              },
            };
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
          }
        );
      })
      .catch((err) => {
        toast.error(getError(err));
      });
  };

  useEffect(() => {
    console.log('checking user first user');
    const userExisted = async () => {
      const querySnap = await getDocs(collection(db, 'users'));
      if (querySnap.empty) {
        // setRole('admin');

        const element = document.getElementById('accountType');
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

      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          id="floatingDisplayName"
          name="displayName"
          value={newUser.firstName}
          onChange={handleInputChange}
          placeholder="x"
          required
        />
        <label for="floatingDisplayName">Display Name</label>
      </div>
      <div className="form-floating">
        {' '}
        <input
          className="form-control mb-3"
          type="email"
          id="floatingEmail"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="x"
          required
        />
        <label for="floatingEmail">Email</label>
      </div>
      <div className="form-floating mb-3">
        {' '}
        <input
          className="form-control"
          type="password"
          id="floatingPassword"
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="x"
          required
        />
        <label for="floatingPassword">Password</label>
      </div>

      <select
        class="form-select mb-3"
        onChange={handleInputChange}
        aria-label="Default select example"
        id="accountType"
        name="accountType"
      >
        <option selected>Select Account Type</option>
        <option value="supplier">Supplier</option>
        <option value="comsumer">Consumer</option>
      </select>

      <div className="mb-3">
        Log In to account isntead!
        <Link to={'/signin'}>Log-In</Link>
      </div>

      <button className="btn btn-primary" onClick={submitHandler} type="submit">
        Sign Up
      </button>
      {/* <Form onSubmit={onSubmitHandler}>
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
            <Form.Group controlId="role" onChange={selectedRoleHandler}>
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
         </Form> */}
    </Container>
  );
}
