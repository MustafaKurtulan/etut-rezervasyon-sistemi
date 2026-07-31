import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../store/store";

axios.defaults.baseURL = "http://localhost:5054/api/";
// axios.defaults.withCredentials = true;

axios.interceptors.request.use((request) => {
    const token = store.getState().account.user?.token;
    if(token)
        request.headers.Authorization = `Bearer ${token}`;
    return request;
});

axios.interceptors.response.use
(response => {
    return response;
}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch(status)
    {
        case 400:
            if (data.errors) {
                const modelErrors: string[] = [];

                for (const key in data.errors) {
                 modelErrors.push(data.errors[key]);
                }

                throw modelErrors;
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 404:
            router.navigate("/not-found");
            break;
        case 500:
            router.navigate("/server-error", { state: { error: data, status } });
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const queries = {
    get: (url: string) => axios.get(url).then((r: AxiosResponse) => r.data),
    post: (url: string, body: {}) => axios.post(url, body).then((r: AxiosResponse) => r.data),
    put: (url: string, body: {}) => axios.put(url, body).then((r: AxiosResponse) => r.data),
    delete: (url: string) => axios.delete(url).then((r: AxiosResponse) => r.data),
};

const Desks = {
  list: () => queries.get("desk"),
  details: (id: number) => queries.get(`desk/${id}`),
  create: (data: any) => queries.post("desk", data),
  update: (id: number, data: any) => queries.put(`desk/${id}`, data),
  delete: (id: number) => queries.delete(`desk/${id}`)
};

const Users = {
  list: () => queries.get("users"),
};

const Errors = {
    get400Error: () => queries.get("/Error/bad-request"),
    get401Error: () => queries.get("/Error/unauthorized"),
    get404Error: () => queries.get("/Error/not-found"),
    get500Error: () => queries.get("/Error/server-error"),
    getValidationError: () => queries.get("/Error/validation-error"), 
};

const Account = {
    login: (FormData: any) => queries.post("account/login", FormData),
    register: (FormData: any) => queries.post("account/register", FormData),
    getUser: () => queries.get("account/getuser")
}

const requests = {
     Errors, Account, Desks, Users
}; 

export default requests;