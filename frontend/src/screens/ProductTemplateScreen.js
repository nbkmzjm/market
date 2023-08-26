import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import Button from 'react-bootstrap/esm/Button';
import EditProductModal from '../components/Modal/EditProductModal';

export default function ProductTemplateScreens() {
   const [products, setProducts] = useState([]);
   const [product, setProduct] = useState({});
   const [showModal, setShowModal] = useState(false);

   //  useEffect(() => {
   //     const fetchProducts = async () => {
   //        const productArray = [];
   //        const snapshot = await getDocs().collection('products').get();
   //        snapshot.forEach((doc) => {
   //           const product = { ...doc.data(), id: doc.id };
   //           productArray.push(product);
   //        });

   //        setProducts(productArray);
   //     };

   //     fetchProducts();
   //  }, []);

   useEffect(() => {
      const fetchProducts = async () => {
         const productArray = [];
         const querySnapshot = await getDocs(collection(db, 'product'));
         if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
               const product = { ...doc.data(), id: doc.id };
               productArray.push(product);
            });
         }

         setProducts(productArray);
      };

      fetchProducts();
   }, []);
   const setShowModalHandler = (boolean) => {
      setShowModal(boolean);
   };
   const editProductHandler = (productId) => {
      console.log(productId);
      setShowModal(true);
      const fetchProduct = async () => {
         const snapshot = await getDoc(doc(db, 'product', productId));
         if (snapshot.exists()) {
            console.log('Document data:', snapshot.data());
            setProduct({ ...snapshot.data(), id: snapshot.id });
         } else {
            console.log('No such document!');
         }
      };
      fetchProduct();
   };

   const addToStoreHandler = () => {};

   return (
      <div className="container">
         <EditProductModal
            showModal={showModal}
            product={product}
            modalClose={setShowModalHandler}
         />
         <div className="row">
            <div className="col-12">
               <div className="card-header">
                  <h5 className="">Product</h5>
               </div>
               <div className="card-body">
                  <ul className="list-group list-group-flush">
                     {/* <li className="list-group-item">
                        <div className="row">
                           <div className="col-2"></div>
                           <div className="col-6">Product</div>
                           <div className="col-2">Quantity</div>
                           <div className="col-2">Total Price</div>
                        </div>
                     </li> */}
                     {products.map((product) => (
                        <li key={product.id} className="list-group-item">
                           <div className="row">
                              <div className="col-2">
                                 <img
                                    src={product.image}
                                    alt={product.name}
                                    height="100"
                                    width="100"
                                    className="img-fluid rounded img-thumbnail"
                                 ></img>{' '}
                              </div>
                              <div className="col-6">{product.name}</div>
                              <div className="col-2">
                                 <Button
                                    variant="primary"
                                    onClick={() =>
                                       editProductHandler(product.id)
                                    }
                                 >
                                    Edit
                                 </Button>
                              </div>
                              <div className="col-2">
                                 {' '}
                                 <Button
                                    variant="primary"
                                    onClick={addToStoreHandler}
                                 >
                                    Add to Store
                                 </Button>
                              </div>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
}
