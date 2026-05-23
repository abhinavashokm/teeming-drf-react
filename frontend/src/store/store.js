import { configureStore } from "@reduxjs/toolkit";
import { injectStore } from "../api/axios";
import authReducer from './slices/authSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
    }
})

// Inject store into axios AFTER store is fully initialized
injectStore(store);


export default store