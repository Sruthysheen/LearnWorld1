import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    cartId: '',
}

const cartSlice =createSlice({
    name:"cart",
    initialState,
    reducers:{
        addCartId:(state,action)=>{
            state.cartId=''
            state.cartId = action.payload;
        }
    }
})

export const {addCartId} =cartSlice.actions;

export const selectCartCount =(state:any)=>state.cart.cartId;

export default cartSlice.reducer;