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

  const accountId = state.userInfo.account.accountId;
  const [num, setNum] = useState(0);

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  //  const [itemRemoved, setItemRemoved] = useState('');
  console.log('ini', state);
  console.log('myProducts', myProducts);

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
      const myProductsSnapshot = await getDocs(
        collection(db, 'accounts', accountId, 'accountProducts')
      );
      const myProductFSid = myProductsSnapshot.docs.map(
        (item) => item.data().id
      );

      console.log(myProductFSid);
      if (myProductFSid.includes(product.id)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProductDatawithId = async (productId) => {
    const productRef = collection(db, 'retailProduct');
    // const q = query(productRef, where('su')
  };

  const removeFromStoreHandler = async (productId) => {
    const removeItemFS = async () => {
      console.log('remove:', productId);
      try {
        const itemToDeleteRef = doc(
          db,
          'accounts',
          state.userInfo.account.accountId,
          'accountProducts',
          productId
        );
        const deletedItemSnap = await deleteDoc(itemToDeleteRef);
        console.log(deletedItemSnap);
      } catch (error) {
        console.log(error);
        toast.error('Cannot remove product');
      }
    };

    await removeItemFS();
    console.log('remove and now updating my products...');

    const updateMyProduct = async () => {
      console.log('updating my products...');
      const productsAfterUpdate = [];
      try {
        const docSnap = await getDocs(
          collection(
            db,
            'accounts',
            state.userInfo.account.accountId,
            'accountProducts'
          )
        );
        if (docSnap.size > 0) {
          docSnap.forEach((product) => {
            productsAfterUpdate.push({
              ...product.data(),
              id: product.id,
            });
          });
        }
        console.log('productAfterUpdate', productsAfterUpdate);
        // setMyProducts((prev) => {
        //    console.log('prev', prev);
        //    console.log('productsAfterUpdate', productsAfterUpdate);
        //    return [productsAfterUpdate];
        // });
        setMyProducts(productsAfterUpdate);
      } catch (error) {
        console.log(error);
      }
    };
    await updateMyProduct();

    toast.success('Product removed successfully');
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

  //  useEffect(() => {}, []);

  useEffect(() => {
    console.log('template effect run');
    const fetchProductsAndMyProducts = async () => {
      const fetchProducts = async () => {
        console.log('fetching products');
        const productArray = [];
        const querySnapshotProduct = await getDocs(collection(db, 'product'));
        console.log('querySnapshotProduct', querySnapshotProduct);
        if (!querySnapshotProduct.empty) {
          for (const doc of querySnapshotProduct.docs) {
            let product = {
              ...doc.data(),
              id: doc.id,
            };
            const added = await fetchAddedProductData(product);
            console.log(added);
            product = { ...product, addedToStore: added };
            productArray.push(product);
          }
        }
        console.log('Done fetching added product data', productArray);
        console.log('productArray', productArray);
        setProducts(productArray);
      };

      fetchProducts();

      const fetchMyProducts = async () => {
        console.log('fetching my products');
        const myProductArray = [];

        const querySnapMyProducts = await getDocs(
          collection(
            db,
            'accounts',
            state.userInfo.account.accountId,
            'accountProducts'
          )
        );
        console.log('querySnapMyProducts', querySnapMyProducts);
        if (!querySnapMyProducts.empty) {
          for (const doc of querySnapMyProducts.docs) {
            myProductArray.push({ ...doc.data(), id: doc.id });
          }
        }
        console.log('myProductArray', myProductArray);
        setMyProducts(myProductArray);
      };
      fetchMyProducts();
    };
    fetchProductsAndMyProducts();
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
    // setTimeout(() => {
    //    // setIsLoading(false);
    //    setNum((prev) => prev + 1);
    // }, 3000);
    // const updateProductsAndMyProducts = async () => {
    const updateMyProducts = async () => {
      const productSnap = await getDoc(doc(db, 'product', productId));
      console.log('productSnap', productSnap);
      if (productSnap.exists()) {
        const productData = {
          ...productSnap.data(),
          accountId: state.userInfo.account.accountId,
          productId: productSnap.id,
        };
        await addDoc(
          collection(
            db,
            'accounts',
            state.userInfo.account.accountId,
            'accountProducts'
          ),
          productData
        );

        setMyProducts((prev) => [...prev, productData]);
        console.log('productId', productId);
      }
    };
    await updateMyProducts();

    const updateProducts = async () => {
      const myProductsSnapshot = await getDocs(
        collection(db, 'accounts', accountId, 'accountProducts')
      );
      console.log(myProductsSnapshot, 'myProductsSnapshot');
      const myProductFSid = myProductsSnapshot.docs.map(
        (item) => item.data().id
      );

      console.log(myProductFSid);

      const modifiedProducts = products.map((product) => {
        if (myProductFSid.includes(product.id)) {
          return { ...product, addedToStore: true };
        }
        return product;
      });

      setProducts(modifiedProducts);
      console.log('modifiedProducts', modifiedProducts);
    };

    await updateProducts();

    toast.success('Product added to store!');
    // };

    // updateProductsAndMyProducts();
  };

  const editInventoryHandler = async (productId) => {
    console.log(productId);
    setShowModal(true);
    const fetchProduct = async () => {
      try {
        const snapshot = await getDoc(
          doc(db, 'accounts', accountId, 'accountProducts', productId)
        );
        if (snapshot.exists()) {
          console.log('Document data:', snapshot.data());
          setProduct({ ...snapshot.data(), id: snapshot.id });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
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
                        onClick={() => editProductHandler(product.id)}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="col-2">
                      <Button
                        variant="primary"
                        disabled={product.addedToStore}
                        onClick={() => addToStoreHandler(product.id)}
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
                        onClick={() => editInventoryHandler(product.id)}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="col-2">
                      <Button
                        variant="primary"
                        onClick={() => removeFromStoreHandler(product.id)}
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
