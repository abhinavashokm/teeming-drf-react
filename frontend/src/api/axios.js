import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    },
    withCredentials: true,
})


//for debugging purpose
api.interceptors.response.use(
    (response) => {
        console.log(response.data)
        return response
    },
    (error) => {
        console.log(error.response.data)
        return Promise.reject(error)
    }
)


export default api