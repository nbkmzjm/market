import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HelmetProvider } from 'react-helmet-async';
import StoreProvider from './Store';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserProvider';
import { CartProvider } from './contexts/CartProvider';
ReactDOM.render(
   <React.StrictMode>
      <StoreProvider>
         <UserProvider>
            <CartProvider>
               <HelmetProvider>
                  <BrowserRouter>
                     <App />
                  </BrowserRouter>
               </HelmetProvider>
            </CartProvider>
         </UserProvider>
      </StoreProvider>
   </React.StrictMode>,

   document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// reportWebVitals();
