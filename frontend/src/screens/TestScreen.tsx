import React, { useState, useEffect } from 'react';

function ExampleComponent() {
   const [count, setCount] = useState(0);
   console.log(count);

   useEffect(() => {
      console.log('Component mounted');
      setCount(5);
      console.log(count);
      //   const interval = setInterval(() => {
      //      setCount((prevCount) => prevCount + 1);
      //   }, 1000);

      //   return () => {
      //      console.log('Component will unmount');
      //      setCount(7);
      //      console.log(count);
      //      //  clearInterval(interval); // Clear the interval timer
      //   };
   },);

   return (
      <div>
         <h1>Component Unmount Example</h1>
         <p>Count: {count}</p>
         <button
            onClick={() => {
               setCount(9);
               console.log(count);
            }}
         ></button>
      </div>
   );
}

export default ExampleComponent;
