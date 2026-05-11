import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";


export const login = createAsyncThunk(
    'auth/login', 
    async({email, password}) => {
        const res = await authService.login({email, password})
        return res.data
})


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: null,
        loading: true
    },
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
        }
    },
    extraReducers: (builder) => {

        builder

        //login
        .addCase(login.pending, (state) => {

            state.loading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            
            state.accessToken = action.payload.access_token
            state.loading = false
        })
        .addCase(login.rejected, (state) => {

            state.loading = true
        });
        
    }
})


export const { setAccessToken } = authSlice.actions
export default authSlice.reducer