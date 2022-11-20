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



export const newFeedbackReducer = (state = { feedback: {} }, action) => {
    switch (action.type) {

        case NEW_FEEDBACK_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_FEEDBACK_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                feedback: action.payload.feedback
            }

        case NEW_FEEDBACK_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_FEEDBACK_RESET:
            return {
                ...state,
                success: false,
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                loading: false
            }
        default:
            return state
    }
}


export const feedbackDetailsReducer = (state = { feedback: {} }, action) => {
    switch (action.type) {

        case GET_FEEDBACK_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_FEEDBACK_SUCCESS:
            return {
                loading: false,
                feedback: action.payload.feedback
            }

        case GET_FEEDBACK_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case GET_FEEDBACK_RESET:
            return {
                ...state,
                 feedback: undefined
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}


export const allFeedBacksReducer = (state = {feedbacks:[]}, action) => {
  switch(action.type){
      case GET_FEEDBACKS_REQUEST:
      case GET_USER_FEEDBACKS_REQUEST:
            return{
				...state,
				loading: true,
			}
      case GET_FEEDBACKS_SUCCESS:
      case GET_USER_FEEDBACKS_SUCCESS:
            return{
				...state,
				loading:false,
				feedbacks:action.payload.feedbacks
			}
      case GET_FEEDBACKS_FAIL:
      case GET_USER_FEEDBACKS_FAIL:
            return{
              loading:false,
              error:action.payload
            }

      case CLEAR_ERRORS:
            return{
              ...state,
              error:null
            }
      default:
            return state;

  }
}