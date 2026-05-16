import { setAccessToken, clearAuth } from "../../store/slices/authSlice";

export const authResponseInterceptor =
    async (store, api, error) => {
        console.log(error.response?.data)

        const isRefreshCall = error.config?.url === "/auth/refresh/"

        if (error.response?.status === 401 && !isRefreshCall) {
            try {

                // call refresh endpoint → get new access token
                const res_data = await api.post('/auth/refresh/')
                const accessToken = res_data.access_token

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

