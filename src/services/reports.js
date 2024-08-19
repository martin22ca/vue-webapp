import { axiosClient } from '@/plugins/axios';
import { getTokenAndPath } from './auth';

const BASE_URL = '/reports'

/**
 * Asynchronously fetches a list of roles using an HTTP GET request through the axiosClient.
 * @returns {Promise} A promise that resolves to the response from the server (list of roles) or rejects with an error.
 */
export async function getReports() {
    try {
        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 10000,
            params: {}
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}

export async function getReport(data, id_report) {
    try {
        const stringifiedData = JSON.stringify(data);
        return await axiosClient({
            url: BASE_URL + '/report',
            method: 'GET',
            timeout: 10000,
            params: { filters: stringifiedData, id_report: id_report }
        })
    } catch (error) {
        console.error('Error Updating Role:', error);
        throw error
    }
}


export async function getRoleUser() {
    try {
        const [token, path] = getTokenAndPath()
        return await axiosClient({
            url: BASE_URL + '/getrole',
            method: 'GET',
            timeout: 10000,
            params: { token: token }
        })
    } catch (error) {
        console.error('Error Updating Role:', error);
        throw error
    }
}