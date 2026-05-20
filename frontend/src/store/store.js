import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import workspaceReducer from './slices/workspaceSlice'
import { injectStore } from "../api/axios";


const store = configureStore({
    reducer: {
        auth: authReducer,
        workspace: workspaceReducer,
    }
})

// Inject store into axios AFTER store is fully initialized
injectStore(store);


export default store