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

export async function getRecordsInfoUser(token, data = null) {
    try {
        const stringifiedData = JSON.stringify(data);
        return await axiosClient({
            url: BASE_URL + '/userInfo',
            method: 'GET',
            timeout: 5000,
            params: { token: token, filters: stringifiedData }
        })
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error
    }
}

export async function addRecordtoUser(data = null) {
    try {
        return await axiosClient({
            url: BASE_URL + '/addrecord',
            method: 'POST',
            timeout: 5000,
            data: data
        })
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error
    }
}

export async function updateRecordsUser(data = null) {
    try {
        return await axiosClient({
            url: BASE_URL + '/updaterecord',
            method: 'PUT',
            timeout: 5000,
            data: data
        })
    } catch (error) {
        console.error('Error updating records:', error);
        throw error
    }
}

export async function saveRecordsUser(data = null) {
    try {
        return await axiosClient({
            url: BASE_URL + '/saverecords',
            method: 'PUT',
            timeout: 5000,
            data: data
        })
    } catch (error) {
        console.error('Error updating records:', error);
        throw error
    }
}