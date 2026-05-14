import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import { injectStore } from "../api/axios";


const store = configureStore({
    reducer: {
        auth: authReducer,
    }
})

// Inject store into axios AFTER store is fully initialized
injectStore(store);


export default store