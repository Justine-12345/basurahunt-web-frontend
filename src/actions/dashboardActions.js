import axios from 'axios';

import { 
    TOTAL_USERS_REQUEST,
    TOTAL_USERS_SUCCESS,
    TOTAL_USERS_FAIL,
    
    TOTAL_DUMPS_REQUEST,
    TOTAL_DUMPS_SUCCESS,
    TOTAL_DUMPS_FAIL,
    
    TOTAL_DONATIONS_REQUEST,
    TOTAL_DONATIONS_SUCCESS,
    TOTAL_DONATIONS_FAIL,
    
    DONATED_ITEMS_REQUEST,
    DONATED_ITEMS_SUCCESS,
    DONATED_ITEMS_FAIL,
    
    CLEANED_DUMPS_REQUEST,
    CLEANED_DUMPS_SUCCESS,
    CLEANED_DUMPS_FAIL,
    
    UNCLEANED_DUMPS_REQUEST,
    UNCLEANED_DUMPS_SUCCESS,
    UNCLEANED_DUMPS_FAIL,

    WASTE_COLLECTION_PER_TRUCK_REQUEST,
    WASTE_COLLECTION_PER_TRUCK_SUCCESS,
    WASTE_COLLECTION_PER_TRUCK_FAIL,

    COLLECTION_POINT_REQUEST,
    COLLECTION_POINT_SUCCESS,
    COLLECTION_POINT_FAIL,

    REPORT_PER_CATEGORY_REQUEST,
    REPORT_PER_CATEGORY_SUCCESS,
    REPORT_PER_CATEGORY_FAIL,

    DONATION_PER_CATEGORY_REQUEST,
    DONATION_PER_CATEGORY_SUCCESS,
    DONATION_PER_CATEGORY_FAIL,


    CLEAR_ERRORS 
} from '../constants/dashboardConstants';

export const getTotalUsers = () => async (dispatch) => {
    try {

        dispatch({ type: TOTAL_USERS_REQUEST })

        const { data } = await axios.get(`/api/v1/dashboard/totalUsers`)
        
        dispatch({
            type: TOTAL_USERS_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: TOTAL_USERS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getTotalDumps = () => async (dispatch) => {
    try {

        dispatch({ type: TOTAL_DUMPS_REQUEST })

        const { data } = await axios.get(`/api/v1/dashboard/totalDumps`)
        
        dispatch({
            type: TOTAL_DUMPS_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: TOTAL_DUMPS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getTotalDonations = () => async (dispatch) => {
    try {

        dispatch({ type: TOTAL_DONATIONS_REQUEST })

        const { data } = await axios.get(`/api/v1/dashboard/totalDonations`)
        
        dispatch({
            type: TOTAL_DONATIONS_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: TOTAL_DONATIONS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getDonatedItems = (dashboardData) => async (dispatch) => {
    try {

        dispatch({ type: DONATED_ITEMS_REQUEST })

        const { data } = await axios.post('/api/v1/dashboard/donatedItems', dashboardData)

        dispatch({
            type: DONATED_ITEMS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: DONATED_ITEMS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCleanedDumps = (dashboardData) => async (dispatch) => {
    try {

        dispatch({ type: CLEANED_DUMPS_REQUEST })

        const { data } = await axios.post('/api/v1/dashboard/cleanedDumps', dashboardData)

        dispatch({
            type: CLEANED_DUMPS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CLEANED_DUMPS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getUncleanedDumps = (dashboardData) => async (dispatch) => {
    try {

        dispatch({ type: UNCLEANED_DUMPS_REQUEST })

        const { data } = await axios.post('/api/v1/dashboard/uncleanedDumps', dashboardData)

        dispatch({
            type: UNCLEANED_DUMPS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UNCLEANED_DUMPS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCollectionPerTruck = (dashboardData) => async (dispatch) => {
    try {

        dispatch({ type: WASTE_COLLECTION_PER_TRUCK_REQUEST })

        const { data } = await axios.post('/api/v1/dashboard/collection-per-truck', dashboardData)
     
        dispatch({
            type: WASTE_COLLECTION_PER_TRUCK_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: WASTE_COLLECTION_PER_TRUCK_FAIL,
            payload: error.response.data.message
        })
    }
}


export const getCollectionPoints = (dashboardData) => async (dispatch) => {
    try {
        dispatch({ type: COLLECTION_POINT_REQUEST })

        const { data } = await axios.post('/api/v1/dashboard/collectionPoints', dashboardData)

        dispatch({
            type: COLLECTION_POINT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: COLLECTION_POINT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getReportsPerCategory = (dashboardData) => async (dispatch) => {
    try {

        dispatch({ type: REPORT_PER_CATEGORY_REQUEST })

        const { data } = await axios.post('/api/v1/dashboard/reportsPerCategory', dashboardData)

        dispatch({
            type: REPORT_PER_CATEGORY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: REPORT_PER_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getDonationsPerCategory = (dashboardData) => async (dispatch) => {
    try {

        dispatch({ type: DONATION_PER_CATEGORY_REQUEST })

        const { data } = await axios.post('/api/v1/dashboard/donationsPerCategory', dashboardData)

        dispatch({
            type: DONATION_PER_CATEGORY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: DONATION_PER_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) =>{
    dispatch({
        type: CLEAR_ERRORS
    })
}