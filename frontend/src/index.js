import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/indexStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HelmetProvider } from 'react-helmet-async';
import StoreProvider from './Store';
ReactDOM.render(
   <React.StrictMode>
      <StoreProvider>
         <HelmetProvider>
            <App />
         </HelmetProvider>
      </StoreProvider>
   </React.StrictMode>,

   document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();