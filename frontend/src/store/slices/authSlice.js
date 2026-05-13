import { createSlice, createAsyncThunk, isPending, isRejected, isFulfilled } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { errorCodes } from "../../constants/errorCodes";


const handleThunkError = (error, thunkAPI) => {

    // No response received
    if (!error.response) {

        return thunkAPI.rejectWithValue({
            code: errorCodes.UNKNOWN_ERROR,
            message: error.message || "Unable to connect to server."
        })
    }

    // Response exists
    return thunkAPI.rejectWithValue(
        error.response.data ?? {
            code: errorCodes.UNKNOWN_ERROR,
            message: "Something went wrong!"
        }
    )

}

const asyncHandler = async (apiCall, thunkAPI) => {
    try {
        return await apiCall()
    } catch (error) {
        return handleThunkError(error, thunkAPI)
    }
}

export const login = createAsyncThunk(
    'auth/login',

    async ({ email, password }, thunkAPI) => {

        return asyncHandler(
            () => authService.login({ email, password }),
            thunkAPI
        )

    })


export const signup = createAsyncThunk(
    "auth/signup",
    async ({ email, password, full_name }, thunkAPI) => {

        return asyncHandler(
            () => authService.signup({ email, password, full_name }),
            thunkAPI
        )

    }
)

export const verifyOTP = createAsyncThunk(
    "auth/verifyOTP",
    async ({ verificationEmail, otp }, thunkAPI) => {

        return asyncHandler(
            () => authService.verifyOTP({ email: verificationEmail, otp }),
            thunkAPI
        )

    }
)


export const resendOTP = createAsyncThunk(
    "auth/resendOTP",
    ({ verificationEmail }, thunkAPI) => {
        return asyncHandler(
            () => authService.resendOTP({ email: verificationEmail }),
            thunkAPI
        )
    }
)


export const forgotPassword = createAsyncThunk(
    "auth/forgot-password",
    async ({ email }, thunkAPI) => {

        return asyncHandler(
            () => authService.forgotPassword({ email }),
            thunkAPI
        )

    }
)


export const resetPassword = createAsyncThunk(
    "auth/reset-password",
    async ({ reset_token, password }, thunkAPI) => {

        return asyncHandler(
            () => authService.resetPassword({ token: reset_token, password }),
            thunkAPI
        )

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
            .addCase(login.fulfilled, (state, action) => {

                state.user = action.payload.data.user
                state.accessToken = action.payload.access_token
            })

            //SIGNUP
            .addCase(signup.fulfilled, (state, action) => {

                state.verificationEmail = action.payload.data.email
            })

            //VERIFY OTP
            .addCase(verifyOTP.fulfilled, (state, action) => {

                state.user = action.payload.user
            })

            // GENERIC MATCHERS LAST
            .addMatcher(
                isPending(
                    login,
                    signup,
                    verifyOTP,
                    resendOTP,
                    forgotPassword,
                    resetPassword,
                ),
                (state) => {
                    state.loading = true
                    state.error = null
                }
            )

            .addMatcher(isFulfilled(
                login,
                signup,
                verifyOTP,
                resendOTP,
                forgotPassword,
                resetPassword,
            ),
                (state) => {
                    state.loading = false
                    state.error = null
                }
            )

            .addMatcher(
                isRejected(
                    login,
                    signup,
                    verifyOTP,
                    resendOTP,
                    forgotPassword,
                    resetPassword,
                ),
                (state, action) => {
                    state.loading = false
                    state.error = action.payload
                }
            )
    }
})


export const { setAccessToken, clearAuthError } = authSlice.actions
export default authSlice.reducer