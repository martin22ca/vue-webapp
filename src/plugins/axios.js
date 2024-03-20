import axios from 'axios'

const API_BASE_URL = '/api';

const createAxiosClient = () => {
    return axios.create({
        baseURL: API_BASE_URL,
    });
}
export const axiosClient = createAxiosClient();