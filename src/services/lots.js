import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/lots'

export async function getLots(data = null) {
    try {
        const stringifiedData = JSON.stringify(data);

        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 5000,
            params: { filters: stringifiedData },
        });
    } catch (error) {
        console.error('Error fetching lots:', error);
        throw error;
    }
}
