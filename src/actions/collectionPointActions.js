import axios from 'axios';

import { 
    TODAY_COLLECTION_POINT_LIST_REQUEST,
    TODAY_COLLECTION_POINT_LIST_SUCCESS,
    TODAY_COLLECTION_POINT_LIST_FAIL,

    UPCOMING_COLLECTION_POINT_LIST_REQUEST,
    UPCOMING_COLLECTION_POINT_LIST_SUCCESS,
    UPCOMING_COLLECTION_POINT_LIST_FAIL,

    COLLECTION_POINT_LIST_REQUEST,
    COLLECTION_POINT_LIST_SUCCESS, 
    COLLECTION_POINT_LIST_FAIL,

    ALL_COLLECTORS_REQUEST,
    ALL_COLLECTORS_SUCCESS,
    ALL_COLLECTORS_FAIL,

    ALL_COLLECTION_POINTS_REQUEST,
    ALL_COLLECTION_POINTS_SUCCESS, 
    ALL_COLLECTION_POINTS_FAIL,

    COLLECTION_POINT_DETAILS_REQUEST,
    COLLECTION_POINT_DETAILS_SUCCESS,
    COLLECTION_POINT_DETAILS_FAIL,

    NEW_COLLECTION_POINT_REQUEST,
    NEW_COLLECTION_POINT_SUCCESS,
    NEW_COLLECTION_POINT_FAIL,

    UPDATE_COLLECTION_POINT_REQUEST,
    UPDATE_COLLECTION_POINT_SUCCESS,
    UPDATE_COLLECTION_POINT_FAIL,

    DELETE_COLLECTION_POINT_REQUEST,
    DELETE_COLLECTION_POINT_SUCCESS,
    DELETE_COLLECTION_POINT_FAIL,

    ADD_COLLECTION_NUMBER_OF_TRUCK_REQUEST,
    ADD_COLLECTION_NUMBER_OF_TRUCK_SUCCESS,
    ADD_COLLECTION_NUMBER_OF_TRUCK_FAIL,
 
    LIVE_NOTIFICATION_REQUEST,
    LIVE_NOTIFICATION_SUCCESS,
    LIVE_NOTIFICATION_RESET,
    LIVE_NOTIFICATION_FAIL,

    CLEAR_ERRORS 
} from '../constants/collectionPointConstants';

export const getTodayCollectionPointList = () => async (dispatch) => {
    try {

        dispatch({ type: TODAY_COLLECTION_POINT_LIST_REQUEST })

        let link = `/api/v1/collectionPoint/today`
        
        const {data} = await axios.get(link);

        dispatch({
            type: TODAY_COLLECTION_POINT_LIST_SUCCESS,
            payload: data.collectionPoints
        })

    } catch (error) {

        dispatch({
            type: TODAY_COLLECTION_POINT_LIST_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getUpcomingCollectionPointList = () => async (dispatch) => {
    try {

        dispatch({ type: UPCOMING_COLLECTION_POINT_LIST_REQUEST })

        let link = `/api/v1/collectionPoint/upcoming`
        
        const {data} = await axios.get(link);

        dispatch({
            type: UPCOMING_COLLECTION_POINT_LIST_SUCCESS,
            payload: data.collectionPoints
        })

    } catch (error) {

        dispatch({
            type: UPCOMING_COLLECTION_POINT_LIST_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCollectionPointList = (currentPage=1) => async (dispatch) => {
    try {
        dispatch({
            type: COLLECTION_POINT_LIST_REQUEST
        })

        let link = `/api/v1/collectionPoints?page=${currentPage}`
        
        const {data} = await axios.get(link);
        
        dispatch({
            type: COLLECTION_POINT_LIST_SUCCESS,
            payload: data
        })
    } catch(error) {
        dispatch({
            type: COLLECTION_POINT_LIST_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCollectionPointDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: COLLECTION_POINT_DETAILS_REQUEST })
        const { data } = await axios.get(`/api/v1/collectionPoint/${id}`)
        dispatch({
            type: COLLECTION_POINT_DETAILS_SUCCESS,
            payload: data.collectionPoint
        })
    } catch (error) {
        dispatch({
            type: COLLECTION_POINT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCollectors = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_COLLECTORS_REQUEST })

        const { data } = await axios.get(`/api/v1/admin/collectionPoint/collectors`)

        dispatch({
            type: ALL_COLLECTORS_SUCCESS,
            payload: data.collectors
        })

    } catch (error) {

        dispatch({
            type: ALL_COLLECTORS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCollectionPoints = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_COLLECTION_POINTS_REQUEST })

        const { data } = await axios.get(`/api/v1/admin/collectionPoints`)

        dispatch({
            type: ALL_COLLECTION_POINTS_SUCCESS,
            payload: data.collectionPoints
        })

    } catch (error) {

        dispatch({
            type: ALL_COLLECTION_POINTS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newCollectionPoint = (collectionPointData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_COLLECTION_POINT_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post(`/api/v1/admin/collectionPoint/new`, collectionPointData, config)

        dispatch({
            type: NEW_COLLECTION_POINT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_COLLECTION_POINT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateCollectionPoint = (id, collectionPointData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_COLLECTION_POINT_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/collectionPoint/${id}`, collectionPointData, config)

        dispatch({
            type: UPDATE_COLLECTION_POINT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_COLLECTION_POINT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteCollectionPoint = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_COLLECTION_POINT_REQUEST })

        const { data } = await axios.delete(`/api/v1/admin/collectionPoint/${id}`)

        dispatch({
            type: DELETE_COLLECTION_POINT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_COLLECTION_POINT_FAIL,
            payload: error.response.data.message
        })
    }
}


export const addCollectionnumOfTruck = (id, collectionPointData) => async (dispatch) => {
    try {

        dispatch({ type: ADD_COLLECTION_NUMBER_OF_TRUCK_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/api/v1/collectionPoint/num-of-truck/${id}`, collectionPointData, config)

        dispatch({
            type: ADD_COLLECTION_NUMBER_OF_TRUCK_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: ADD_COLLECTION_NUMBER_OF_TRUCK_FAIL,
            payload: error.response.data.message
        })
    }
}



export const liveMapNotification = (id, liveData) => async (dispatch) => {
    try {
        dispatch({ type: LIVE_NOTIFICATION_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/api/v1/collectionPoint/live-notification/${id}`, liveData, config)
        dispatch({
            type: LIVE_NOTIFICATION_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: LIVE_NOTIFICATION_FAIL,
            payload: error.response.data.message
        })
    }
}





export const clearErrors = () => async (dispatch) =>{
    dispatch({
        type: CLEAR_ERRORS
    })
}