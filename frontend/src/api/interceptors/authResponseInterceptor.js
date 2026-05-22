import { setAccessToken, clearAuth } from "../../store/slices/authSlice";
import { REFRESH_URL } from "../../services/authService";

export const authResponseInterceptor =
    async (store, api, error) => {
        console.log(error.response?.data)

        // prevent infinite retry loop
        if (error.config?._retry) {
            return Promise.reject(error)
        }

        // only handle 401, reject everything else immediately
        if (status !== 401) {

            return Promise.reject(error)
        }

        const isRefreshCall = error.config?.url?.includes(REFRESH_URL)

        if (error.response?.status === 401 && !isRefreshCall) {

            error.config._retry = true

            try {

                // call refresh endpoint → get new access token
                const res = await api.post(REFRESH_URL)
                const accessToken = res.data.data.accessToken

                // store new access token in redux
                store.dispatch(setAccessToken(accessToken))

                // retry original request
                error.config.headers.Authorization = `Bearer ${accessToken}`
                console.log("no error")
                return api({
                    ...error.config,
                    _retry: true  // ← explicitly carry it into the new request
                })

            } catch (refreshError) {
                console.log("refresh error")

                // Refresh token itself expired → log user out
                store.dispatch(clearAuth())
                return Promise.reject(refreshError)

            }
        }


        return Promise.reject(error)
        // refresh logic
    }

