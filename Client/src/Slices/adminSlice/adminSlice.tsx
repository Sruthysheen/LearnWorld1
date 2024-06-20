import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface adminState {
  admin: any; 
}

export interface AdminState{
  admindata : adminState | null;
}

const initialState: adminState = {
  admin: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.admin = action.payload;
    },

    logout: (state) => {
      state.admin = null;
    },
  },
});

export const { login, logout } = adminSlice.actions;
export const selectAdmin = (state: { admin: adminState }) => state.admin.admin;

export default adminSlice.reducer;