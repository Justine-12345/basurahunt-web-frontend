import axios from 'axios';
import {
		NEW_FEEDBACK_REQUEST,
		NEW_FEEDBACK_SUCCESS,
		NEW_FEEDBACK_RESET,
		NEW_FEEDBACK_FAIL,

		GET_FEEDBACK_REQUEST,
		GET_FEEDBACK_SUCCESS,
		GET_FEEDBACK_FAIL,
		GET_FEEDBACK_RESET,

		GET_FEEDBACKS_REQUEST,
		GET_FEEDBACKS_SUCCESS,
		GET_FEEDBACKS_FAIL,
		GET_FEEDBACKS_RESET,

		GET_USER_FEEDBACKS_REQUEST,
		GET_USER_FEEDBACKS_SUCCESS,
		GET_USER_FEEDBACKS_FAIL,
		GET_USER_FEEDBACKS_RESET,

		CLEAR_ERRORS
	}  from '../constants/feedbackConstants'



// New feedback
export const newfeedback = (feedbackData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_FEEDBACK_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/feedback/new', feedbackData, config)

        dispatch({
            type: NEW_FEEDBACK_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_FEEDBACK_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get feedbacks
export const getFeedback = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_FEEDBACK_REQUEST })

       
        const { data } = await axios.get(`/api/v1/feedback/${id}`)
      
        dispatch({
            type: GET_FEEDBACK_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_FEEDBACK_FAIL,
            payload: error.response.data.message
        })
    }
}

//get feedback for user
export const getUserFeedbacks = () => async (dispatch) => {
    try {

        dispatch({ type: GET_USER_FEEDBACKS_REQUEST })

        const { data } = await axios.get(`/api/v1/feedbacks`)
        
        dispatch({
            type: GET_USER_FEEDBACKS_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: GET_USER_FEEDBACKS_FAIL,
            payload: error.response.data.message
        })
    }
}


//get feedback for admin
export const getFeedbacks = () => async (dispatch) => {
    try {

        dispatch({ type: GET_FEEDBACKS_REQUEST })

        const { data } = await axios.get(`/api/v1/admin/feedbacks/`)
        
        dispatch({
            type: GET_FEEDBACKS_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: GET_FEEDBACKS_FAIL,
            payload: error.response.data.message
        })
    }
}


export const clearErrors = () => async (dispatch) =>{
    dispatch({
        type: CLEAR_ERRORS
    })
}