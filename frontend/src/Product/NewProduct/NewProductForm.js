import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { productCreateAction } from "../../store/indexStore";

const NewProductForm = (props) => {
   
   const category = useSelector((state) => state.category);
   // const [category, setCategory] = useState("initial");
   console.log(category);
   const dispatch= useDispatch()
   const onSelect = (event) => {
      // props.seletedCategory(event.target.value);
      // setCategory(event.target.value);
      console.log(event.target.value)
      dispatch(productCreateAction.categorySelected(event.target.value));
      
   };

   return (
      <form>
         <div>
            <div>
               <div>
                  <label> {category}</label>
                  <input value={category} type="text" />
               </div>
               <div>
                  <label> Price</label>
                  <input type="text" />
               </div>
               <div>
                  <label> Date</label>
                  <input type="text" />
               </div>
               <div>
                  <label> Category</label>
                  <select onChange={onSelect}>
                     <option>Gel</option>
                     <option>Power</option>
                     <option>Arcylic</option>
                  </select>
               </div>
            </div>
         </div>
      </form>
   );
};

export default NewProductForm;
