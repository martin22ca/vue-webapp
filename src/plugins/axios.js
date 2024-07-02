import axios from 'axios'

const API_BASE_URL = '/api';
const DEV_BASE_URL = 'http://127.0.0.1:8002/';

const createAxiosClient = () => {
    return axios.create({
        baseURL: API_BASE_URL,
    });
}
export const axiosClient = createAxiosClient();