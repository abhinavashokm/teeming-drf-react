import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: null,
        user: null,
    },
    reducers: {
        setUser: (state, action) => { state.user = action.payload },

        setAccessToken: (state, action) => { state.accessToken = action.payload },

        clearAuthError: (state) => {
            if (state) state.error = null
        },

        clearAuth: (state) => {
            state.user = null
            state.accessToken = null
        }

    }
})


export const { setAccessToken, clearAuthError, clearAuth, setUser } = authSlice.actions
export default authSlice.reducer