import { axiosClient } from '@/plugins/axios';

const BASE_URL = '/records'

export async function getRecords(data = null) {
    try {
        const stringifiedData = JSON.stringify(data);

        return await axiosClient({
            url: BASE_URL + '/',
            method: 'GET',
            params: { filters: stringifiedData }
        })
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error
    }
}


export async function getRecordsAssigned(data = null) {
    try {
        const stringifiedData = JSON.stringify(data);

        return await axiosClient({
            url: BASE_URL + '/assigned',
            method: 'GET',
            params: { filters: stringifiedData }
        })
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error
    }
}

export async function getRecordsInfo(data = null, idLot = null) {
    try {
        const stringifiedData = JSON.stringify(data);
        return await axiosClient({
            url: BASE_URL + '/info',
            method: 'GET',
            params: { filters: stringifiedData, 'id_lot': idLot }
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
            data: data
        })
    } catch (error) {
        console.error('Error updating records:', error);
        throw error
    }
}


export async function removeRecordUser(data = null) {
    try {
        return await axiosClient({
            url: BASE_URL + '/removeuserecord',
            method: 'PUT',
            data: data
        })
    } catch (error) {
        console.error('Error updating records:', error);
        throw error
    }
}
removeRecordUser