import React from 'react';
import Form from 'react-bootstrap/esm/Form';

export default function SupplierOptionMenu(props) {
   const { selectedOption } = props;
   const { options } = props;
   console.log();
   return (
      <div>
         <Form.Select>
            {options.map((option) => (
               <option
                  key={option.id}
                  value={option.id}
                  selected={option.displayName === selectedOption.displayName}
               >
                  {option.displayName}
               </option>
            ))}
         </Form.Select>
      </div>
   );
}
