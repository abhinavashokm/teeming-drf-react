
export const authRequestInterceptor = (store, config) => {
    const token = store.getState().auth.accessToken

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}
