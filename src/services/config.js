
//useRuntimeConfig().public.apiBase = 
import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/config'

export async function getConfig() {
    try {
        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            timeout: 10000,
        })
    } catch (error) {
        console.error('Error fetching configuration:', error);
        throw error
    }
}
export async function setCols(data, idCol) {
    try {
        return await axiosClient({
            url: BASE_URL + '/setCols',
            method: 'POST',
            timeout: 10000,
            data: { data: data, id: idCol }
        })
    } catch (error) {
        console.error('Error fetching configuration:', error);
        throw error
    }
}

export async function getConfigId(idCol) {
    try {
        return await axiosClient({
            url: BASE_URL + '/cols',
            method: 'GET',
            timeout: 10000,
            params: {id: idCol }
        })
    } catch (error) {
        console.error('Error fetching configuration:', error);
        throw error
    }
}

export async function getfilters() {
    try {
        return await axiosClient({
            url: BASE_URL + '/filters',
            method: 'GET',
            timeout: 10000,

        })
    } catch (error) {
        console.error('Error fetching configuration:', error);
        throw error
    }
}

export async function postAssignment(formData) {
    try {
        return await axiosClient({
            url: BASE_URL + '/assignment',
            method: 'POST',
            timeout: 120000,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData
        })
    } catch (error) {
        console.error('Error fetching configuration:', error);
        throw error
    }
}

export async function postDb(formData) {
    try {
        return await axiosClient({
            url: BASE_URL + '/db',
            method: 'POST',
            timeout: 1200000,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData
        })
    } catch (error) {
        console.error('Error fetching configuration:', error);
        throw error
    }
}