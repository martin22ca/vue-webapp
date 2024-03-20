import axios from 'axios'
const API_HOST = import.meta.env.VITE_API_HOST
const PORT = import.meta.env.VITE_PORT
const PROTOCOL = 'http://';

const createAxiosClient = () => {
    console.log('test');
    console.log(`${PROTOCOL}${API_HOST}:${PORT}`);
    return axios.create({
        baseURL: `${PROTOCOL}${API_HOST}:${PORT}`,
    });
}
export const axiosClient = createAxiosClient();