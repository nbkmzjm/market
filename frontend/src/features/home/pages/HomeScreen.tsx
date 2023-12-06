import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, Route } from 'react-router-dom';
// import data from '../data';
import ProductList from '../../products/components/ProductList';

export default function HomeScreen() {
   return (
      <div>
         <ProductList></ProductList>
         Welcome to macXXXXYYY
      </div>
   );
}
