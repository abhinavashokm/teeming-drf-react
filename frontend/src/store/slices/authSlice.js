import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { errorCodes } from "../../constants/errorCodes";

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, thunkAPI) => {
        try {

            const res = await authService.login({ email, password })
            return res

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    code: errorCodes.UNKNOWN_ERROR,
                    message: "something went wrong!"
                }
            )

        }

    })


export const signup = createAsyncThunk(
    "auth/signup",
    async ({ email, password, full_name }, thunkAPI) => {
        try {

            return await authService.signup({ email, password, full_name })

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    code: errorCodes.UNKNOWN_ERROR,
                    message: "something went wrong!",
                }
            )
        }
    }
)

export const verifyOTP = createAsyncThunk(
    "auth/verifyOTP",
    async ({ verificationEmail, otp }, thunkAPI) => {

        try {

            return await authService.verifyOTP({ email: verificationEmail, otp })

        } catch (error) {
          
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    code: errorCodes.UNKNOWN_ERROR,
                    message: "something went wrong!",
                }
            )
        }

    }
)


const authSlice = createSlice({
    name: 'auth',
    initialState: {

        accessToken: null,
        user: null,

        verificationEmail: null, //for storing email after signup for otp verification

        error: null,
        loading: false

    },
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
        },

        clearAuthError: (state) => {
            state.error = null
        },

    },
    extraReducers: (builder) => {

        builder

            //LOGIN
            .addCase(login.pending, (state) => {

                state.error = null
                state.loading = true
            })
            .addCase(login.fulfilled, (state, action) => {

                state.user = action.payload.data.user
                state.accessToken = action.payload.access_token
                state.error = null
                state.loading = false
            })
            .addCase(login.rejected, (state, action) => {

                state.error = action.payload
                state.loading = false
            })

            //SIGNUP
            .addCase(signup.pending, (state) => {

                state.error = null
                state.loading = true
            })
            .addCase(signup.fulfilled, (state, action) => {

                state.verificationEmail = action.payload.data.email
                state.error = null
                state.loading = false
            })
            .addCase(signup.rejected, (state, action) => {

                state.loading = false
                state.error = action.payload
            })

            //VERIFY OTP
            .addCase(verifyOTP.pending, (state) => {

                state.loading = true
                state.error = null
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {

                state.loading = false
                state.error = null
                state.user = action.payload.user
            })
            .addCase(verifyOTP.rejected, (state, action) => {

                state.loading = false
                state.error = action.payload
            })
            ;

    }
})


export const { setAccessToken, clearAuthError } = authSlice.actions
export default authSlice.reducer