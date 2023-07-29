import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import {
   addDoc,
   collection,
   deleteDoc,
   doc,
   getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ProductEditScreen() {
   const [movieList, setMovieList] = useState([]);
   const productRef = collection(db, 'product');

   useEffect(() => {
      const getMovieList = async () => {
         try {
            const data = await getDocs(productRef);
            const filteredData = data.docs.map((doc) => ({
               ...doc.data(),
               id: doc.id,
            }));
            console.log(data);
            console.log(filteredData);
         } catch (err) {
            console.log(err);
         }
      };
      getMovieList();
   }, []);
   const seedingHandler = async (e) => {
      e.preventDefault();

      const querySnapshot = await getDocs(productRef);
      querySnapshot.forEach((document) => {
         deleteDoc(doc(db, 'product', document.id));
      });

      try {
         await addDoc(productRef, {
            name: 'Artisan GelEfex Gel Nail Polish',
            slug: 'Artisan-GelEfex-Gel-Nail-Polish',
            price: 10,
            cost: 7,
            brand: 'Artisan',
            category: 'Gel',
            size: 0.5,
            unit: 'oz',
            image: 'https://m.media-amazon.com/images/I/B1DBWbloIpS._CLa%7C2140%2C2000%7C91y%2B4ymrM4L.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UL1500_.png',
            countInStock: 0,
            ratings: 4,
            description:
               'Extra thick gel doesn’t mean durable, sometimes it just means messy. Good thing this brush on gel is neither',
            Note: 'new item',
         });

         await addDoc(productRef, {
            name: 'Artisan Colored Acrylic Nail Powder | Professional Size - Green',
            slug: 'Artisan-Colored-Acrylic-Nail-Powder-Professional-Size-Green',
            price: 10,
            cost: 6,
            brand: 'Artisan',
            category: 'Acrylic',
            size: 0.44,
            unit: 'oz',
            image: 'https://i5.walmartimages.com/asr/0ec1b72b-a123-48ff-bf98-6da928961de7.18a7b7de3003eeecd8db166e91532cae.jpeg',
            countInStock: 20,
            ratings: 4,
            description:
               ' It will wear wonderfully for summer and spring inspired 3D nail art designs and nail enhancements',
            Note: 'new item',
         });

         await addDoc(productRef, {
            name: 'Glow in Dark Nail Pigment Powder | Pack #1',
            slug: 'Glow-in-Dark-Nail-Pigment-Powder-Pack-1',
            price: 12,
            cost: 4,
            brand: 'TNS',
            category: 'Color Dipping Power',
            size: 12,
            unit: 'tray',
            image: 'https://m.media-amazon.com/images/I/B1pDnrUmaHS._CLa%7C2140%2C2000%7C91qSQl4VrZL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UL1500_.png',
            countInStock: 30,
            ratings: 4,
            description:
               'Show up to shine with a set of 12 glow-in-the-dark color powder',
            Note: 'new item',
         });
      } catch (err) {
         console.log(err);
      }

      alert('ssdf');
   };

   return (
      <div>
         <Button onClick={seedingHandler}>Seeding product</Button>
      </div>
   );
}
