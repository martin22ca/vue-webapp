import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/records'

export async function getRecords(data = null) {
    try {
        const stringifiedData = JSON.stringify(data);

        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 5000,
            params: { filters: stringifiedData }
        })
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error
    }
}

export async function getRecordsInfo(data = null) {
    try {
        const stringifiedData = JSON.stringify(data);
        return await axiosClient({
            url: BASE_URL + '/info',
            method: 'GET',
            timeout: 5000,
            params: { filters: stringifiedData }
        })
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error
    }
}