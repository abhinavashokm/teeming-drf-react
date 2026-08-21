import { configureStore } from "@reduxjs/toolkit";
import { injectStore } from "../api/axios";
import authReducer from './slices/authSlice';
import tourReducer from "./slices/tourSlice"


const store = configureStore({
    reducer: {
        auth: authReducer,
        tour: tourReducer,
    },
    devTools: import.meta.env.DEV,
})

// Inject store into axios AFTER store is fully initialized
injectStore(store);


export default store