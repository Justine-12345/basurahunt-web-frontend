import {
    NEWSFEED_LIST_REQUEST,
    NEWSFEED_LIST_SUCCESS, 
    NEWSFEED_LIST_FAIL,
    
    ALL_NEWSFEEDS_REQUEST,
    ALL_NEWSFEEDS_SUCCESS, 
    ALL_NEWSFEEDS_FAIL,

    NEWSFEED_DETAILS_REQUEST,
    NEWSFEED_DETAILS_SUCCESS,
    NEWSFEED_DETAILS_FAIL,

    NEW_NEWSFEED_REQUEST,
    NEW_NEWSFEED_SUCCESS,
    NEW_NEWSFEED_RESET, 
    NEW_NEWSFEED_FAIL,

    UPDATE_NEWSFEED_REQUEST,
    UPDATE_NEWSFEED_SUCCESS,
    UPDATE_NEWSFEED_RESET,
    UPDATE_NEWSFEED_FAIL,

    DELETE_NEWSFEED_REQUEST,
    DELETE_NEWSFEED_SUCCESS,
    DELETE_NEWSFEED_RESET,
    DELETE_NEWSFEED_FAIL,

    CLEAR_ERRORS 
} from '../constants/newsfeedConstants'

export const newsfeedsReducer = (state = { newsfeeds:[] }, action) => {
    switch(action.type) {
        case NEWSFEED_LIST_REQUEST:
        case ALL_NEWSFEEDS_REQUEST:
        return {
            ...state,
            loading: true
        }
        case NEWSFEED_LIST_SUCCESS:
        case ALL_NEWSFEEDS_SUCCESS:
        return {
            ...state,
            loading:false,
            newsfeeds: action.payload.newsfeeds,
            tags: action.payload.tags

        }
        case NEWSFEED_LIST_FAIL:
        case ALL_NEWSFEEDS_FAIL:
        return {
            ...state,
            loading:false,
            error: action.payload
        }
        case CLEAR_ERRORS:
        return {
             ...state,
             error: null
        }
        default:
        return state;
     }
}

export const newsfeedReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_NEWSFEED_REQUEST:
        case UPDATE_NEWSFEED_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DELETE_NEWSFEED_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_NEWSFEED_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }

        case DELETE_NEWSFEED_FAIL:
        case UPDATE_NEWSFEED_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_NEWSFEED_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_NEWSFEED_RESET:
            return {
                ...state,
                isUpdated: false
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

export const newsfeedDetailsReducer = (state = { newsfeed: {} }, action) => {
    switch (action.type) {
        case NEWSFEED_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case NEWSFEED_DETAILS_SUCCESS:
            return {
                loading: false,
                newsfeed: action.payload.newsfeed,
                tags:action.payload.tags
            }
        case NEWSFEED_DETAILS_FAIL:
            return {
                ...state,
                error: action.payload
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

export const newNewsfeedReducer = (state = { newsfeed: {} }, action) => {
    switch (action.type) {

        case NEW_NEWSFEED_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_NEWSFEED_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                newsfeed: action.payload.newsfeed
            }

        case NEW_NEWSFEED_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_NEWSFEED_RESET:
            return {
                ...state,
                success: false
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