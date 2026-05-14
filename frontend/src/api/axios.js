import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";
import { authRequestInterceptor } from "./interceptors/authRequestInterceptor";
import { authResponseInterceptor } from "./interceptors/authResponseInterceptor";

const api = applyCaseMiddleware(axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    },
    withCredentials: true, //Send cookies with cross-origin requests.
}))


// Store reference — injected after store is created, never imported directly
let _store;
export const injectStore = (store) => { _store = store; };

//attach access token to every request's header
api.interceptors.request.use( 
    (config) => authRequestInterceptor(_store, config)
)


api.interceptors.response.use(

    //response - success case
    (response) => {
        console.log(response.data)
        return response
    },

    //response - error case
    async (error) => authResponseInterceptor(_store, api, error)

    
    
   
)


export default api