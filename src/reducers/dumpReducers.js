import {
		DUMPS_REQUEST,
		DUMPS_SUCCESS,
		DUMPS_FAIL,
        DUMP_LIST_REQUEST,
        DUMP_LIST_SUCCESS,
        DUMP_LIST_FAIL,
		NEW_DUMP_REQUEST,
		NEW_DUMP_SUCCESS,
		NEW_DUMP_FAIL,
		NEW_DUMP_RESET,
		ALL_DUMP_REQUEST,
		ALL_DUMP_SUCCESS,
		ALL_DUMP_FAIL,
		DUMP_DETAILS_REQUEST,
		DUMP_DETAILS_SUCCESS,
		DUMP_DETAILS_FAIL,
		DUMP_DETAILS_RESET,
		UPDATE_DUMP_REQUEST,
		UPDATE_DUMP_SUCCESS,
		UPDATE_DUMP_FAIL,
		UPDATE_DUMP_RESET,
		DELETE_DUMP_REQUEST,
		DELETE_DUMP_SUCCESS,
		DELETE_DUMP_FAIL,
		DELETE_DUMP_RESET,
		DUMP_RANKING_REQUEST,
		DUMP_RANKING_SUCCESS,
		DUMP_RANKING_FAIL,
		DUMP_RANKING_RESET,
        DUMP_COMMENT_REQUEST,
        DUMP_COMMENT_SUCCESS,
        DUMP_COMMENT_FAIL,
        DUMP_COMMENT_RESET,
        DUMP_GET_COMMENT_REQUEST,
        DUMP_GET_COMMENT_SUCCESS,
        DUMP_GET_COMMENT_FAIL,
        DUMP_GET_COMMENT_RESET,
        UPDATE_DUMP_STATUS_REQUEST,
        UPDATE_DUMP_STATUS_SUCCESS,
        UPDATE_DUMP_STATUS_FAIL,
        UPDATE_DUMP_STATUS_RESET,
        DUMP_DELETE_COMMENT_REQUEST,
        DUMP_DELETE_COMMENT_SUCCESS,
        DUMP_DELETE_COMMENT_FAIL,
        DUMP_DELETE_COMMENT_RESET,
		CLEAR_ERRORS
	}  from '../constants/dumpConstants'


export const dumpsReducer = (state = {dumps:[]}, action) => {
  switch(action.type){
      case DUMPS_REQUEST:
            return{
              loading: true,
              disease:[]
            }

      case DUMPS_SUCCESS:
            return{
              loading:false,
              dumps:action.payload.dumps,
              dumpsCount: action.payload.dumpsCount,
              filteredDumpCount: action.payload.filteredDumpCount,
              resPerPage: action.payload.resPerPage
            }

      case DUMPS_FAIL:
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


export const newDumpReducer = (state = { dump: {} }, action) => {
    switch (action.type) {

        case NEW_DUMP_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_DUMP_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                dump: action.payload.dump
            }

        case NEW_DUMP_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_DUMP_RESET:
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


export const allDumpsReducer = (state = {dumps:[]}, action) => {
  switch(action.type){
      case DUMP_LIST_REQUEST:
      case ALL_DUMP_REQUEST:
            return{
				...state,
				loading: true,
			}
      case DUMP_LIST_SUCCESS:
      case ALL_DUMP_SUCCESS:
            return{
				...state,
				loading:false,
				dumps:action.payload.dumps
			}
      case DUMP_LIST_FAIL:
      case ALL_DUMP_FAIL:
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



export const dumpDetailsReducer = (state = { dump: {} }, action) => {
    switch (action.type) {

        case DUMP_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DUMP_DETAILS_SUCCESS:
            return {
                loading: false,
                dump: action.payload.dump,
                chat: action.payload.chat
            }

        case DUMP_DETAILS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DUMP_DETAILS_RESET:
            return {
                ...state,
                 dump: undefined
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






export const dumpCommentReducer = (state = [], action) => {
    switch (action.type) {

        case DUMP_COMMENT_REQUEST:
        case DUMP_GET_COMMENT_REQUEST:
        case DUMP_DELETE_COMMENT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DUMP_COMMENT_SUCCESS:
        case DUMP_GET_COMMENT_SUCCESS:
            return {
                loading: false,
                comments: action.payload.dumpComments
            }

        case DUMP_DELETE_COMMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case DUMP_COMMENT_FAIL:
        case DUMP_GET_COMMENT_FAIL:
        case DUMP_DELETE_COMMENT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DUMP_COMMENT_RESET:
        case DUMP_GET_COMMENT_RESET:
            return {
                ...state,
                 comments: undefined
            }

        case DUMP_DELETE_COMMENT_RESET:
            return {
                ...state,
                isDeleted: false
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





export const dumpReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_DUMP_REQUEST:
        case UPDATE_DUMP_REQUEST:
        case UPDATE_DUMP_STATUS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DELETE_DUMP_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_DUMP_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload.success,
                dump: action.payload.dump
            }

        case UPDATE_DUMP_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdatedStatus: action.payload
            }

        case UPDATE_DUMP_FAIL:
        case DELETE_DUMP_FAIL:
        case UPDATE_DUMP_STATUS_FAIL:
            return {
                ...state,
                error: action.payload
            }

         case DELETE_DUMP_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_DUMP_RESET:
            return {
                ...state,
                isUpdated: false,
            }

        case UPDATE_DUMP_STATUS_RESET:
             return {
                ...state,
                isUpdatedStatus: false,
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


export const rankingReducer = (state = {}, action) => {
  switch(action.type){
      case DUMP_RANKING_REQUEST:
            return{
				...state,
				loading: true,
			}

      case DUMP_RANKING_SUCCESS:
            return{
				...state,
				loading:false,
				mostReportedBrgyDone:action.payload.mostReportedBrgyDone,
				mostReportedBrgyUndone:action.payload.mostReportedBrgyUndone,
				topBrgyUser:action.payload.topBrgyUser,
				topCityUser:action.payload.topCityUser,
                barangaysOrDistrictStatuses: action.payload.barangaysOrDistrictStatuses,
                topUserForAdmin: action.payload.topUserForAdmin
			}

	  case DUMP_RANKING_RESET:
            return {
                ...state,
                mostReportedBrgyDone: undefined,
				mostReportedBrgyUndone: undefined,
				topBrgyUser: undefined,
				topCityUser: undefined
            }

      case DUMP_RANKING_FAIL:
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
