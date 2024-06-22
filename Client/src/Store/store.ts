import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";


import studentReducer from "../Slices/studentSlice/studentSlice";
import tutorReducer from "../Slices/tutorSlice/tutorSlice";
import adminReducer from "../Slices/adminSlice/adminSlice";
import courseReducer from "../Slices/tutorSlice/courseSlice";
import cartReducer from '../Slices/studentSlice/cartSlice';
import walletReducer from '../Slices/studentSlice/walletSlice';


const tutorConfig = {
  key: 'tutor',
  storage
};

const studentConfig = {
  key: 'student',
  storage
};

const courseConfig = {
  key: 'course',
  storage 
};

const adminConfig = {
  key: 'admin',
  storage 
};

const cartConfig={
  key : 'cart',
  
  storage 
}

const walletConfig={
  key : 'wallet',
  storage
}

const persistedTutorReducer = persistReducer(tutorConfig, tutorReducer);
const persistedCourseReducer = persistReducer(courseConfig, courseReducer);
const persistedStudentReducer = persistReducer(studentConfig, studentReducer);
const persistedAdminReducer = persistReducer(adminConfig, adminReducer);
const persistedCartReducer=persistReducer(cartConfig , cartReducer);
const persistedWalletReducer = persistReducer(walletConfig, walletReducer)


const store = configureStore({
  reducer: {
    student: persistedStudentReducer,
    tutor: persistedTutorReducer,
    admin: persistedAdminReducer,
    course: persistedCourseReducer,
    cart:persistedCartReducer,
    wallet:persistedWalletReducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

const persistedStore = persistStore(store);


export { store, persistedStore };
