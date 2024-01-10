import React from 'react';
import useProducts from '../hooks/useProducts';
import LoadingBox from '../../../components/LoadingBox';
import MessageBox from '../../../components/MessageBox';
import { Col, Row } from 'react-bootstrap';
import ProductComp from './ProductComp';

export default function ProductList() {
   const { products, loading, error } = useProducts();
   return (
      <>
         {' '}
         <h1>Procduct List</h1>
         {console.log('render product list')}
         <div className="products">
            {loading ? (
               <LoadingBox />
            ) : error ? (
               <MessageBox variant="danger">{error}</MessageBox>
            ) : (
               <Row>
                  {products.map((product) => (
                     <Col
                        key={product.slug}
                        sm={6}
                        md={6}
                        lg={3}
                        className="mb-3"
                     >
                        {' '}
                        {product.name}
                        <ProductComp product={product}></ProductComp>
                     </Col>
                  ))}
               </Row>
            )}
         </div>{' '}
      </>
   );
}
