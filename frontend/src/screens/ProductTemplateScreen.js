import {
   addDoc,
   collection,
   deleteDoc,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import Button from 'react-bootstrap/esm/Button';
import EditProductModal from '../components/Modal/EditProductModal';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function ProductTemplateScreens() {
   const { state, dispatch } = useContext(Store);

   const [products, setProducts] = useState([]);
   const [product, setProduct] = useState({});
   const [showModal, setShowModal] = useState(false);
   const [myProducts, setMyProducts] = useState([]);
   console.log('ini', products);

   // const [productAdded, setProductAdded] = useState([]);

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

   const fetchAddedProductData = async (product) => {
      try {
         const productAddedRef = collection(db, 'retailProduct');
         const q = query(
            productAddedRef,
            where('templateId', '==', product.id),
            where('supplierId', '==', state.userInfo.uid)
         );

         const productAdded = await getDocs(q);

         if (productAdded.empty) {
            return false;
         } else {
            return true;
         }
      } catch (error) {
         console.error(`Error fetching data for ${doc}:`, error);
      }
   };

   const removeFromStoreHandler = async (productId) => {
      console.log('remove:', productId);
      try {
         await deleteDoc(doc(db, 'retailProduct', productId));
         setMyProducts(
            myProducts.filter((product) => product.id !== productId)
         );

         // const modifiedProducts = products.map((product) => {
         //    if (product.id !== productId) {
         //       return { ...product, AddedToStore: false };
         //    }
         //    return product;
         // });

         // setProducts(modifiedProducts);

         toast.success('Product removed successfully');
      } catch (error) {
         toast.error('Cannot remove product');
      }
   };

   const ProductData = [
      {
         id: 'IGr9BGRLyXvg86xZL4Se',
         name: 'Glow in Dark Nail Pigment Powder | Pack #1',
      },
      { id: 'K5vMqgtpFtvDC64AeKPr', name: 'Artisan GelEfex Gel Nail Polish' },
      {
         id: 'zXi81WU2JpthAcaksuhj',
         name: 'Artisan Colored Acrylic Nail Powder | Professional Size - Green',
      },
   ];

   useEffect(() => {
      console.log('template effect run');

      const fetchProducts = async () => {
         const productArray = [];
         const querySnapshot = await getDocs(collection(db, 'product'));
         console.log('querySnapshot', querySnapshot);
         if (!querySnapshot.empty) {
            for (const doc of querySnapshot.docs) {
               let product = {
                  ...doc.data(),
                  id: doc.id,
               };
               const Added = await fetchAddedProductData(product);
               console.log(Added);
               product = { ...product, AddedToStore: Added };
               productArray.push(product);
            }
         }

         setProducts(productArray);
      };

      fetchProducts();

      const fetchMyProducts = async () => {
         const myProductArray = [];
         const q = query(
            collection(db, 'retailProduct'),
            where('supplierId', '==', state.userInfo.uid)
         );
         const myProducts = await getDocs(q);
         if (!myProducts.empty) {
            for (const doc of myProducts.docs) {
               myProductArray.push({ ...doc.data(), id: doc.id });
            }
         }
         console.log('myProductArray', myProductArray);
         setMyProducts(myProductArray);
      };
      fetchMyProducts();
   }, [showModal]);

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

   const addToStoreHandler = async (productId) => {
      try {
         const productSnap = await getDoc(doc(db, 'product', productId));
         console.log('productSnap', productSnap);
         if (productSnap.exists()) {
            const productData = {
               ...productSnap.data(),
               supplierId: state.userInfo.uid,
               templateId: productSnap.id,
            };
            await addDoc(collection(db, 'retailProduct'), productData);

            setMyProducts([...myProducts, productData]);
            console.log('productId', productId);

            const modifiedProducts = products.map((product) => {
               if (product.id === productId) {
                  return { ...product, AddedToStore: true };
               }
               return product;
            });

            setProducts(modifiedProducts);

            toast.success('Product added to store!');
         }
      } catch (error) {
         console.log(error);
         toast.error('Can not add product to store!');
      }
   };

   return (
      <div className="container">
         {console.log('render template screens')}
         <EditProductModal
            showModal={showModal}
            product={product}
            modalClose={setShowModalHandler}
         />
         <div className="row">
            <div className="col-6">
               <div className="card-header">
                  <h5 className="">Product Template</h5>
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
                     {console.log('products', products)}
                     {products.map((product) => (
                        <li key={product.id} className="list-group-item">
                           {console.log('productyyy', product)}
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
                                 <Button
                                    variant="primary"
                                    disabled={product.AddedToStore}
                                    onClick={() =>
                                       addToStoreHandler(product.id)
                                    }
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
            <div className="col-6">
               <div className="card-header">
                  <h5 className="">My Product</h5>
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
                     {console.log('my products', myProducts)}
                     {myProducts.map((product) => (
                        <li key={product.id} className="list-group-item">
                           {console.log('productyyy', product)}
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
                                 <Button
                                    variant="primary"
                                    onClick={() =>
                                       removeFromStoreHandler(product.id)
                                    }
                                 >
                                    Remove
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
