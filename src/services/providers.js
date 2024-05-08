import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/providers'

export async function getProviders(data = null) {
    try {
        const stringifiedData = JSON.stringify(data);

        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 10000,
            params: { filters: stringifiedData },
        });
    } catch (error) {
        console.error('Error fetching providers:', error);
        throw error;
    }
}
