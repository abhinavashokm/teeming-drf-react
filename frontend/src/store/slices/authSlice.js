import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: null,
    },
    reducers: {

        setAccessToken: (state, action) => { state.accessToken = action.payload },

        clearAuth: (state) => {
            state.accessToken = null
        }

    }
})


export const { setAccessToken, clearAuth } = authSlice.actions
export default authSlice.reducer