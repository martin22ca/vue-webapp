import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/roles'

export async function getUsersRoles(data) {
    try {
        const stringifiedData = JSON.stringify(data);

        return await axiosClient({
            url: BASE_URL + '/useroles',
            method: 'GET',
            timeout: 5000,
            params: { filters: stringifiedData }
        })
    } catch (error) {
        console.error('Error fetching Users:', error);
        throw error
    }
}
