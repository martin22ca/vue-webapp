import { axiosClient } from '@/plugins/axios';
import { getTokenAndPath, manageResponse } from './auth';

const BASE_URL = '/users'

export async function getUsers(data) {
    try {
        const stringifiedData = JSON.stringify(data);
        const response = await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 10000,
            params: { filters: stringifiedData }
        })
        console.log(response.status)
        return response
    } catch (error) {
        console.error('Error fetching Users:', error);
        throw error
    }
}

export async function getUsersByRole(id_role) {
    try {
        return await axiosClient({
            url: BASE_URL + '/byrole',
            method: 'GET',
            timeout: 10000,
            params: { 'id_role': id_role }
        })
    } catch (error) {
        console.error('Error fetching Users:', error);
        throw error
    }
}


export async function updateUserRoles(data) {
    try {
        return await axiosClient({
            url: BASE_URL + '/updaterole',
            method: 'PUT',
            timeout: 10000,
            data: data
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
            timeout: 10000,
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
            timeout: 10000,
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
            timeout: 10000,
            data: data
        })
    } catch (error) {
        console.error('Error Updating User:', error);
        throw error
    }
}