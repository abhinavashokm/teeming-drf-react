import { setAccessToken, clearAuth } from "../../store/slices/authSlice";
import { REFRESH_URL } from "../../services/authService";
import { showError } from "../../utils/toast";

export const authResponseInterceptor =
    async (store, api, error) => {
        console.log(error.response?.data)

        // console.log('interceptor hit', {
        //     url: error.config?.url,
        //     retry: error.config?._retry,
        //     status: error.response?.status,
        //     isRefresh: error.config?.url?.includes(REFRESH_URL),
        //     skip: error.config?._skipInterceptor
        // })

        // if (error.config?._skipInterceptor){
        //     console.log("skipping...")
        //     return Promise.reject(error)
        // } 

        // Server unreachable
        if (!error.response) {
            console.log("Server unreachable");
            return Promise.reject({
                ...error,
                isServerUnreachable: true,
            });
        }

        // prevent infinite retry loop
        if (error.config?._retry) {
            return Promise.reject(error)
        }

        // only handle 401, reject everything else immediately
        const status = error.response?.status
        if (status !== 401) {

            return Promise.reject(error)
        }


        const isRefreshCall = error.config?.url?.includes(REFRESH_URL)
        if (isRefreshCall) {
            // store.dispatch(clearAuth())
            return Promise.reject(error)
        }


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
            // store.dispatch(clearAuth())
            return Promise.reject(refreshError)

        }

    }

