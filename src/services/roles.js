import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/roles'

export async function getRoles(data) {
    try {
        const stringifiedData = JSON.stringify(data);

        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 10000,
            params: {}
        })
    } catch (error) {
        console.error('Error fetching Users:', error);
        throw error
    }
}
