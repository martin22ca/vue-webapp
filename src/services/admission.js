import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/admission'

export async function isAuth(tokenData) {
    try {

        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 5000,
            params: { token: tokenData }
        })
    } catch (error) {
        console.error('Error in Auth:', error);
        return error
    }
}

export async function loginUser(data) {
    try {
        
        return await axiosClient({
            url: BASE_URL + '/login',
            method: 'POST',
            timeout: 5000,
            data: data
        })
    } catch (error) {
        console.error('Error registering User:', error);
        throw error
    }
}