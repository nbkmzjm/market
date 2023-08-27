import {
   addDoc,
   collection,
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

   useEffect(() => {
      console.log('template effect run');
      // const fetchProductAdded = async () => {
      //    const productAddedArray = [];
      //    const q = query(
      //       collection(db, 'retailProduct'),
      //       where('supplierId', '==', state.userInfo.uid)
      //    );
      //    const querySnapshot = await getDocs(q);
      //    querySnapshot.forEach((doc) => {
      //       // doc.data() is never undefined for query doc snapshots
      //       console.log(doc.id, ' => ', doc.data());

      //       productAddedArray.push(doc.data().supplierId);
      //    });
      //    setProductAdded(productAddedArray);
      // };
      // fetchProductAdded();

      const fetchProducts = async () => {
         const productArray = [];
         const querySnapshot = await getDocs(collection(db, 'product'));
         if (!querySnapshot.empty) {
            async function fetchData(array) {
               console.log(array);
               await array.forEach(async (doc) => {
                  try {
                     const productx = { ...doc.data(), id: doc.id };
                     console.log('productx', productx);
                     productArray.push(productx);

                     const fetchProductAdded = async () => {
                        const productAddedRef = collection(db, 'retailProduct');
                        const q = query(
                           productAddedRef,
                           where('templateId', '==', productx.id),
                           where('supplierId', '==', state.userInfo.uid)
                        );

                        const productAdded = await getDocs(q);
                        console.log(
                           'product added:',
                           productAdded.empty,
                           'product:',
                           products
                        );
                        // if (productAdded.empty) {
                        // productArray.push(productx);
                        // }
                     };

                     fetchProductAdded();
                  } catch (error) {
                     console.error(`Error fetching data for ${doc}:`, error);
                  }
               });
               setProducts(productArray);
            }

            fetchData(querySnapshot);

            // querySnapshot.forEach(async (doc) => {
            //    const productx = { ...doc.data(), id: doc.id };
            //    console.log('productx', productx);
            //    // productArray.push(productx);

            //    const fetchProductAdded = async () => {
            //       const productAddedRef = collection(db, 'retailProduct');
            //       const q = query(
            //          productAddedRef,
            //          where('templateId', '==', productx.id),
            //          where('supplierId', '==', state.userInfo.uid)
            //       );

            //       const productAdded = await getDocs(q);
            //       if (productAdded.empty) {
            //          productArray.push(productx);
            //       }
            //    };

            //    fetchProductAdded();

            //    // console.log(
            //    //    'product added:',
            //    //    productAdded.empty,
            //    //    'product:',
            //    //    productx
            //    // );

            //    // if (!productAdded.includes(product.id)) {
            //    //    productArray.push(productx);
            //    // }
            // });
            // console.log('product array', productArray);
            // setProducts(productArray);
         }
      };

      fetchProducts();
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
         if (productSnap.exists()) {
            const productData = {
               ...productSnap.data(),
               supplierId: state.userInfo.uid,
               templateId: productSnap.id,
            };
            await addDoc(collection(db, 'retailProduct'), productData);

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
         </div>
      </div>
   );
}
