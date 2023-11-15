import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, Route } from 'react-router-dom';
// import data from '../data';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../Product/Productx';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../functions/utils';
import { Auth, Authen } from '../components/Auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import context from 'react-bootstrap/esm/AccordionContext';
import { Store } from '../Store';
import { getAccountProducts } from '../components/Firestore/FSfx';
import useCart from '../contexts/CartProvider';
import ProductList from '../features/products/components/ProductList';

export default function HomeScreen() {
   return (
      <div>
         <ProductList></ProductList>
      </div>
   );
}
