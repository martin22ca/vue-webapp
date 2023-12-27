import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_BASE_URL
const PORT = import.meta.env.VITE_PORT

const createAxiosClient = (port) => {

    return axios.create({
        baseURL: `${BASE_URL}:${port}`,
    });
}
export const axiosClient = createAxiosClient(PORT);