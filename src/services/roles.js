import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/roles'

/**
 * Asynchronously fetches a list of roles using an HTTP GET request through the axiosClient.
 * @returns {Promise} A promise that resolves to the response from the server (list of roles) or rejects with an error.
 */
export async function getRoles() {
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

export async function updateRole(data) {
    try {
        return await axiosClient({
            url: BASE_URL + '/update',
            method: 'PUT',
            timeout: 10000,
            data: data
        })
    } catch (error) {
        console.error('Error Updating Role:', error);
        throw error
    }
}