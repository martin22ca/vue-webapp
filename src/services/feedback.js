import { axiosClient } from '@/plugins/axios';
import { getTokenAndPath } from './auth';

const BASE_URL = '/feedback'

/**
 * Asynchronously fetches a list of feedbacks using an HTTP GET request through the axiosClient.
 * @returns {Promise} A promise that resolves to the response from the server (list of feedbacks) or rejects with an error.
 */
export async function getFeedback(data = null) {
    try {
        const stringifiedData = JSON.stringify(data);
        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 10000,
            params: {filters: stringifiedData}
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}

export async function registerFeedback(data) {
    try {
        return await axiosClient({
            url: BASE_URL + '/register',
            method: 'POST',
            timeout: 10000,
            data: data
        })
    } catch (error) {
        console.error('Error Updating Role:', error);
        throw error
    }
}

export async function updateFeedback(data) {
    try {
        return await axiosClient({
            url: BASE_URL + '/update',
            method: 'PUT',
            timeout: 10000,
            data: data
        })
    } catch (error) {
        console.error('Error Updating User:', error);
        throw error
    }
}

export async function removeFeedback(data) {
    try {
        return await axiosClient({
            url: BASE_URL + '/remove',
            method: 'DELETE',
            data: data
        })
    } catch (error) {
        console.error('Error Updating User:', error);
        throw error
    }
}
