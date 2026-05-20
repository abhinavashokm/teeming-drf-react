import { setAccessToken, clearAuth } from "../../store/slices/authSlice";
import { REFRESH_URL } from "../../services/authService";

export const authResponseInterceptor =
    async (store, api, error) => {
        console.log(error.response?.data)

        const isRefreshCall = error.config?.url === REFRESH_URL

        if (error.response?.status === 401 && !isRefreshCall) {
            try {

                // call refresh endpoint → get new access token
                const res = await api.post(REFRESH_URL)
                const accessToken = res.data.data.accessToken

                // store new access token in redux
                store.dispatch(setAccessToken(accessToken))

                // retry original request
                error.config.headers.Authorization = `Bearer ${accessToken}`
                return api(error.config)

            } catch (refreshError) {

                // Refresh token itself expired → log user out
                store.dispatch(clearAuth())
                return Promise.reject(refreshError)

            }
        }


        return Promise.reject(error)
        // refresh logic
    }

