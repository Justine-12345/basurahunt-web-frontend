import axios from 'axios'
import {
		GET_CHAT_REQUEST,
		GET_CHAT_SUCCESS,
		GET_CHAT_FAIL,
		GET_CHAT_RESET,
		NEW_CHAT_REQUEST,
		NEW_CHAT_SUCCESS,
		NEW_CHAT_RESET,
		NEW_CHAT_FAIL,
		UPDATE_CHAT_REQUEST,
		UPDATE_CHAT_SUCCESS,
		UPDATE_CHAT_RESET,
		UPDATE_CHAT_FAIL,
		CLEAR_ERRORS
	}  from '../constants/chatConstants'


// New chat
export const newChat = (chatData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_CHAT_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/chat/new', chatData, config)

        dispatch({
            type: NEW_CHAT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_CHAT_FAIL,
            payload: error.response.data.message
        })
    }
}



// Get Chat
export const getChat = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_CHAT_REQUEST })

       
        const { data } = await axios.get(`/api/v1/chat/${id}`)
      
        dispatch({
            type: GET_CHAT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_CHAT_FAIL,
            payload: error.response.data.message
        })
    }
}


// Update chat
export const updateChat = (id, chatData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_CHAT_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        
        const { data } = await axios.put(`/api/v1/chat/${id}`, chatData, config)

        dispatch({
            type: UPDATE_CHAT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_CHAT_FAIL,
            payload: error.response.data.message
        })
    }
}
