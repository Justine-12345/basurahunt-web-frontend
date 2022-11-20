import axios from 'axios';

import { 
    ITEM_LIST_REQUEST,
    ITEM_LIST_SUCCESS, 
    ITEM_LIST_FAIL,

    ADD_ITEM_REQUEST,
    ADD_ITEM_SUCCESS,
    ADD_ITEM_FAIL,

    CLAIM_ITEM_REQUEST,
    CLAIM_ITEM_SUCCESS,
    CLAIM_ITEM_FAIL,

    CANCEL_ITEM_REQUEST,
    CANCEL_ITEM_SUCCESS,
    CANCEL_ITEM_FAIL,

    CONFIRM_ITEM_REQUEST,
    CONFIRM_ITEM_SUCCESS,
    CONFIRM_ITEM_FAIL,

    RECEIVE_ITEM_REQUEST,
    RECEIVE_ITEM_SUCCESS,
    RECEIVE_ITEM_FAIL,

    ALL_ITEMS_REQUEST,
    ALL_ITEMS_SUCCESS, 
    ALL_ITEMS_FAIL,

    ITEM_DETAILS_REQUEST,
    ITEM_DETAILS_SUCCESS,
    ITEM_DETAILS_FAIL,

    NEW_ITEM_REQUEST,
    NEW_ITEM_SUCCESS,
    NEW_ITEM_FAIL,

    UPDATE_ITEM_REQUEST,
    UPDATE_ITEM_SUCCESS,
    UPDATE_ITEM_FAIL,

    DELETE_ITEM_REQUEST,
    DELETE_ITEM_SUCCESS,
    DELETE_ITEM_FAIL,

    CLEAR_ERRORS 
} from '../constants/itemConstants';

export const getItemList = (keyword='', currentPage=1, district='', barangay='', item_type='') => async (dispatch) => {
    try {
        dispatch({
            type: ITEM_LIST_REQUEST
        })

        let districtQ = '';
        let barangayQ = '';
        let item_typeQ = '';

         if (district){
            districtQ = `&district=${district}`
        }

        if (barangay){
            barangayQ = `&barangay=${barangay}`
        }

        if (item_type){
           item_typeQ = `&item_type.type=${item_type}`
        }

        let link = `/api/v1/items?keyword=${keyword}&page=${currentPage}${item_typeQ}${districtQ}${barangayQ}`


        const {data} = await axios.get(link);
        console.log(data)
        dispatch({
            type: ITEM_LIST_SUCCESS,
            payload: data
        })
    } catch(error) {
        dispatch({
            type: ITEM_LIST_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getItemDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ITEM_DETAILS_REQUEST })
        const { data } = await axios.get(`/api/v1/item/${id}`)
        dispatch({
            type: ITEM_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ITEM_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const addItem = (itemData) => async (dispatch) => {
    try {

        dispatch({ type: ADD_ITEM_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post(`/api/v1/item/new`, itemData, config)

        dispatch({
            type: ADD_ITEM_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ADD_ITEM_FAIL,
            payload: error.response.data.message
        })
    }
}

export const claimItem = (id, itemData) => async (dispatch) => {
    try {

        dispatch({ type: CLAIM_ITEM_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/api/v1/item/claim/${id}`, itemData, config)

        dispatch({
            type: CLAIM_ITEM_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: CLAIM_ITEM_FAIL,
            payload: error.response.data.message
        })
    }
}

export const cancelItem = (id, itemData) => async (dispatch) => {
    try {

        dispatch({ type: CANCEL_ITEM_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/api/v1/item/cancel/${id}`, itemData, config)

        dispatch({
            type: CANCEL_ITEM_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: CANCEL_ITEM_FAIL,
            payload: error.response.data.message
        })
    }
}

export const confirmItem = (id, itemData) => async (dispatch) => {
    try {

        dispatch({ type: CONFIRM_ITEM_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/api/v1/item/confirm/${id}`, itemData, config)

        dispatch({
            type: CONFIRM_ITEM_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: CONFIRM_ITEM_FAIL,
            payload: error.response.data.message
        })
    }
}

export const receiveItem = (id, itemData) => async (dispatch) => {
    try {

        dispatch({ type: RECEIVE_ITEM_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/api/v1/item/receive/${id}`, itemData, config)

        dispatch({
            type: RECEIVE_ITEM_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: RECEIVE_ITEM_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getItems = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_ITEMS_REQUEST })

        const { data } = await axios.get(`/api/v1/admin/items`)
        
        dispatch({
            type: ALL_ITEMS_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: ALL_ITEMS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newItem = (itemData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_ITEM_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post(`/api/v1/admin/item/new`, itemData, config)

        dispatch({
            type: NEW_ITEM_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_ITEM_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateItem = (id, itemData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_ITEM_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/item/${id}`, itemData, config)

        dispatch({
            type: UPDATE_ITEM_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_ITEM_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteItem = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_ITEM_REQUEST })

        const { data } = await axios.delete(`/api/v1/admin/item/${id}`)

        dispatch({
            type: DELETE_ITEM_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_ITEM_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) =>{
    dispatch({
        type: CLEAR_ERRORS
    })
}