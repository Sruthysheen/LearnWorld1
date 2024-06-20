import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { parseAst } from "vite";

interface studentState {
    student: string;
}

const initialState: studentState = {
    student: '',
}

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        login: (state,action: PayloadAction<string>) =>{
            state.student = action.payload;
        },
        register:(state, action: PayloadAction<string>)=>{
            state.student = action.payload;
        },
        logout: (state) =>{
            state.student = '';
        },
    },
});

export const {login,register,logout} = studentSlice.actions;

export default studentSlice.reducer


