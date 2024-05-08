import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/lots'

export async function getLots(data = null) {
    try {
        const stringifiedData = JSON.stringify(data);

        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 10000,
            params: { filters: stringifiedData },
        });
    } catch (error) {
        console.error('Error fetching lots:', error);
        throw error;
    }
}

export async function popRecordFromLot(data = null) {
    try {
        return await axiosClient({
            url: BASE_URL + '/removefromlot',
            method: 'DELETE',
            timeout: 10000,
            data: data,
        });
    } catch (error) {
        console.error('Error fetching lots:', error);
        throw error;
    }
}

export async function updateLot(data = null) {
    try {
        return await axiosClient({
            url: BASE_URL + '/update',
            method: 'PUT',
            timeout: 10000,
            data: data,
        });
    } catch (error) {
        console.error('Error fetching lots:', error);
        throw error;
    }
}