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

export async function getPriorities() {
    try {
        return await axiosClient({
            url: BASE_URL + '/priorities',
            method: 'GET',
        });
    } catch (error) {
        console.error('Error fetching providers:', error);
        throw error;
    }
}

export async function updateProvider(data) {
    try {
        return await axiosClient({
            url: BASE_URL + '/update',
            method: 'PUT',
            data: data
        })
    } catch (error) {
        console.error('Error Updating User:', error);
        throw error
    }
}