import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   updateDoc,
   where,
} from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';
import OptionSelect from '../components/OptionSelect';

export default function UserProfileScreen() {
   const { state } = useContext(Store);
   console.log(state);
   const [defaultSupplier, setDefaultSupplier] = useState();
   let [user, setUser] = useState();
   const [supplierOption, setSupplierOption] = useState();
   console.log(user);

   const handleInputChange = (e) => {
      console.log(e.target.key);
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });
   };
   const handleSupplierChange = async (e) => {
      console.log(e.target.value);
      const supplier = supplierOption.find(
         (item) => item.account.accountId === e.target.value
      );
      console.log(supplier);
      user = {
         ...user,
         account: {
            ...user.account,
            defaultSupllier: {
               id: supplier.account.accountId,
               name: supplier.displayName,
            },
         },
      };
      console.log(user);
   };

   const saveHandler = async (e) => {
      e.preventDefault();
      const docRef = doc(db, 'users', state.userInfo.uid);
      //  await getDoc(doc(db, 'user'));
      console.log(supplierOption);
      // console.log(user.account.defaultSupllier.id);
      // const supplier = supplierOption.find(
      //    (item) => item.account.accountId === user.account.defaultSupllier.id
      // );
      // console.log(supplier);
      // user = {
      //    ...user,
      //    account: {
      //       ...user.account,
      //       defaultSupllier: {
      //          ...user.account.defaultSupllier,
      //          name: supplier.displayName,
      //       },
      //    },
      // };
      // console.log(user);
      try {
         await updateDoc(docRef, user);
      } catch (error) {
         console.log(error);
      }
   };
   const fetchSupplier = async () => {
      try {
         const q = query(
            collection(db, 'users'),
            where('account.accountType', '==', 'supplier')
         );
         const resultedArray = [];
         const querySnap = await getDocs(q);
         querySnap.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, ' => ', doc.data());
            resultedArray.push({ id: doc.id, ...doc.data() });
         });
         console.log(resultedArray);
         setSupplierOption(resultedArray);
      } catch (error) {
         toast.error(error);
      }
   };

   useEffect(() => {
      console.log('effect');
      const fetchUser = async () => {
         try {
            const snapshotUser = await getDoc(
               doc(db, 'users', state.userInfo.uid)
            );
            if (snapshotUser.exists()) {
               const userData = {
                  ...snapshotUser.data(),
                  uid: state.userInfo.uid,
               };
               const snapAccount = await getDoc(
                  doc(db, 'accounts', userData.account.accountId)
               );
               if (snapAccount.exists()) {
                  const accountData = { ...snapAccount.data(), ...userData };
                  console.log(accountData);
                  setUser(accountData);
               }
            } else {
               console.log('user does not exist');
            }
         } catch (error) {
            console.log(error);
         }
      };
      fetchUser();
      fetchSupplier();
   }, []);

   return (
      <div>
         {' '}
         {user && (
            <Container className="small-container">
               <Helmet>
                  <title>User Profile</title>
               </Helmet>
               <h1 className="my-3">User Profile</h1>

               <div className="form-floating mb-3">
                  <input
                     className="form-control"
                     type="text"
                     id="floatingDisplayName"
                     name="displayName"
                     value={user.displayName}
                     onChange={handleInputChange}
                     placeholder="x"
                     required
                  />
                  <label htmlFor="floatingDisplayName">Display Name</label>
               </div>
               <div className="form-floating mb-3">
                  {' '}
                  <input
                     className="form-control"
                     type="text"
                     id="floatingBusinessName"
                     name="businessName"
                     value={user.businessName}
                     onChange={handleInputChange}
                     placeholder="x"
                     required
                  />
                  <label htmlFor="floatingPassword">Bussiness Name</label>
               </div>
               <div className="form-floating">
                  {' '}
                  <input
                     className="form-control mb-3"
                     type="email"
                     id="floatingEmail"
                     name="email"
                     value={user.email}
                     onChange={handleInputChange}
                     placeholder="x"
                     required
                  />
                  <label htmlFor="floatingEmail">Email</label>
               </div>
               <div className="form-floating mb-3">
                  {' '}
                  <input
                     className="form-control"
                     type="password"
                     id="floatingPassword"
                     name="password"
                     value={user.password}
                     onChange={handleInputChange}
                     placeholder="x"
                     required
                  />
                  <label htmlFor="floatingPassword">Password</label>
               </div>

               <select
                  className="form-select mb-3"
                  onChange={handleInputChange}
                  aria-label="Default select example"
                  id="accountType"
                  name="account.accountType"
               >
                  <optgroup label="Account Type">
                     <option selected value={user.account.accountType}>
                        {user.account.accountType}
                     </option>
                     {user.account.accountType !== 'supplier' && (
                        <option value="supplier">supplier</option>
                     )}
                     {user.account.accountType !== 'comsumer' && (
                        <option value="comsumer">consumer</option>
                     )}
                  </optgroup>
               </select>

               <select
                  className="form-select mb-3"
                  onChange={handleSupplierChange}
                  aria-label="Default select example"
                  id="defaultSupllier"
                  name="defaultSupllier"
               >
                  <optgroup label="Defaut Supplier">
                     {' '}
                     {/* <option selected>Select a Supplier</option> */}
                     {supplierOption &&
                        supplierOption.map(
                           (option) =>
                              option.displayName !== user.displayName && (
                                 <option
                                    key={option.displayName}
                                    value={option.account.accountId}
                                    selected={
                                       option.displayName === user.displayName
                                    }
                                 >
                                    {option.displayName}
                                 </option>
                              )
                        )}
                  </optgroup>
               </select>

               <button
                  className="btn btn-primary"
                  onClick={saveHandler}
                  type="submit"
               >
                  Save
               </button>
            </Container>
         )}
      </div>
   );
}
