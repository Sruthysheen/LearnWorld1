import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

interface tutorState {
  tutor: any; 
  course:any;
  image:any;
}

export interface TutorState{
  tutordata : tutorState | null;
}

const initialState: tutorState = {
  tutor: null,
  course:null,
  image: null,

};

const tutorSlice = createSlice({
  name: "tutor",
  initialState,
  reducers: {
    tutorlogin: (state, action: PayloadAction<{ tutorName: string; tutorId: string; tutorEmail: string; tutorToken: string }>) => {
      state.tutor = action.payload;
    },
    tutorregister: (state, action: PayloadAction<string>) => {
      state.tutor = action.payload;
    },
    tutorlogout: (state) => {
      state.tutor = null;
      localStorage.removeItem('tutorId')
      localStorage.removeItem('Token')

    },
    updateProfileImage: (state, action: PayloadAction<string>) => {
      if (state.tutor) {
        state.tutor.image = action.payload;
        localStorage.setItem("tutorData", JSON.stringify(state.tutor));
      }
    },
  },
});

export const { tutorlogin, tutorlogout, tutorregister, updateProfileImage} = tutorSlice.actions;

export default tutorSlice.reducer;