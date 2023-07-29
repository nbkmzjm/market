import { createStore } from "redux";
import  '@reduxjs/toolkit';
import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {category: 'None'}

const productCreateSlice= createSlice({
   name: 'category',
   initialState: initialState,
   reducers:{
      categorySelected(state, action){
         state.category= action.payload
      }
   }
})
const counterReducer = (state = initialState, action) => {
   if ((action.type === "categorySelected")) {
      return {
        category: action.value,
      };
   }





   return state;
};
const store = configureStore({
   reducer: productCreateSlice.reducer
});

export const productCreateAction =  productCreateSlice.actions

export default store;
