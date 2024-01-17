import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/users'

export async function getUsers(data) {
    try {
        const stringifiedData = JSON.stringify(data);

        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 5000,
            params: { filters: stringifiedData }
        })
    } catch (error) {
        console.error('Error fetching Users:', error);
        throw error
    }
}


export async function registerUser(data) {
    try {
        return await axiosClient({
            url: BASE_URL + '/register',
            method: 'POST',
            timeout: 5000,
            data: data
        })
    } catch (error) {
        console.error('Error registering User:', error);
        throw error
    }
}


export async function updateUser(data) {
    try {
        return await axiosClient({
            url: BASE_URL + '/update',
            method: 'PUT',
            timeout: 5000,
            data: data
        })
    } catch (error) {
        console.error('Error Updating User:', error);
        throw error
    }
}

export async function removeUser(data) {
    try {
        return await axiosClient({
            url: BASE_URL + '/remove',
            method: 'DELETE',
            timeout: 5000,
            data: data
        })
    } catch (error) {
        console.error('Error Updating User:', error);
        throw error
    }
}