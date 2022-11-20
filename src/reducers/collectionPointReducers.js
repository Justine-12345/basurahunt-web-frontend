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
    ALL_COLLECTORS_RESET,

    ALL_COLLECTION_POINTS_REQUEST,
    ALL_COLLECTION_POINTS_SUCCESS, 
    ALL_COLLECTION_POINTS_FAIL,

    COLLECTION_POINT_DETAILS_REQUEST,
    COLLECTION_POINT_DETAILS_SUCCESS,
    COLLECTION_POINT_DETAILS_FAIL,

    NEW_COLLECTION_POINT_REQUEST,
    NEW_COLLECTION_POINT_SUCCESS,
    NEW_COLLECTION_POINT_RESET, 
    NEW_COLLECTION_POINT_FAIL,

    UPDATE_COLLECTION_POINT_REQUEST,
    UPDATE_COLLECTION_POINT_SUCCESS,
    UPDATE_COLLECTION_POINT_RESET,
    UPDATE_COLLECTION_POINT_FAIL,

    DELETE_COLLECTION_POINT_REQUEST,
    DELETE_COLLECTION_POINT_SUCCESS,
    DELETE_COLLECTION_POINT_RESET,
    DELETE_COLLECTION_POINT_FAIL,

    ADD_COLLECTION_NUMBER_OF_TRUCK_REQUEST,
    ADD_COLLECTION_NUMBER_OF_TRUCK_SUCCESS,
    ADD_COLLECTION_NUMBER_OF_TRUCK_RESET,
    ADD_COLLECTION_NUMBER_OF_TRUCK_FAIL,

    LIVE_NOTIFICATION_REQUEST,
    LIVE_NOTIFICATION_SUCCESS,
    LIVE_NOTIFICATION_RESET,
    LIVE_NOTIFICATION_FAIL,

    CLEAR_ERRORS 
} from '../constants/collectionPointConstants'

export const collectionPointsReducer = (state = { collectionPoints:[] }, action) => {
    switch(action.type) {
        case TODAY_COLLECTION_POINT_LIST_REQUEST:
        case UPCOMING_COLLECTION_POINT_LIST_REQUEST:
        case COLLECTION_POINT_LIST_REQUEST:
        case ALL_COLLECTION_POINTS_REQUEST:
        return {
            ...state,
            loading: true
        }
        case TODAY_COLLECTION_POINT_LIST_SUCCESS:
        case UPCOMING_COLLECTION_POINT_LIST_SUCCESS:
        case COLLECTION_POINT_LIST_SUCCESS:
        case ALL_COLLECTION_POINTS_SUCCESS:
        return {
            ...state,
            loading:false,
            collectionPoints: action.payload
        }
        case TODAY_COLLECTION_POINT_LIST_FAIL:
        case UPCOMING_COLLECTION_POINT_LIST_FAIL:
        case COLLECTION_POINT_LIST_FAIL:
        case ALL_COLLECTION_POINTS_FAIL:
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

export const collectorsReducer = (state = { collectors:[] }, action) => {
    switch(action.type) {
        case ALL_COLLECTORS_REQUEST:
        return {
            ...state,
            loading: true
        }
        case ALL_COLLECTORS_SUCCESS:
        return {
            ...state,
            loading:false,
            collectors: action.payload
        }
        case ALL_COLLECTORS_FAIL:
        return {
            ...state,
            loading:false,
            error: action.payload
        }
        case ALL_COLLECTORS_RESET:
        return{
            ...state,
            collectors: undefined
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

export const collectionPointReducer = (state = {}, action) => {
    switch (action.type) {

        case ADD_COLLECTION_NUMBER_OF_TRUCK_REQUEST:
        case DELETE_COLLECTION_POINT_REQUEST:
        case UPDATE_COLLECTION_POINT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case ADD_COLLECTION_NUMBER_OF_TRUCK_SUCCESS:
            return {
                ...state,
                loading: false,
                isAdded: action.payload
            }

        case DELETE_COLLECTION_POINT_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_COLLECTION_POINT_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }

        case ADD_COLLECTION_NUMBER_OF_TRUCK_FAIL:
        case DELETE_COLLECTION_POINT_FAIL:
        case UPDATE_COLLECTION_POINT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case ADD_COLLECTION_NUMBER_OF_TRUCK_RESET:
            return {
                ...state,
                isAdded: false
            }

        case DELETE_COLLECTION_POINT_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_COLLECTION_POINT_RESET:
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

export const collectionPointDetailsReducer = (state = { collectionPoint: {} }, action) => {
    switch (action.type) {
        case COLLECTION_POINT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case COLLECTION_POINT_DETAILS_SUCCESS:
            return {
                loading: false,
                collectionPoint: action.payload
            }
        case COLLECTION_POINT_DETAILS_FAIL:
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

export const newCollectionPointReducer = (state = { collectionPoint: {} }, action) => {
    switch (action.type) {

        case NEW_COLLECTION_POINT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_COLLECTION_POINT_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                collectionPoint: action.payload.collectionPoint
            }

        case NEW_COLLECTION_POINT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_COLLECTION_POINT_RESET:
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


export const liveNotificationReducer = (state = {}, action) => {
    switch(action.type) {
        case LIVE_NOTIFICATION_REQUEST:
        return {
            ...state,
            loading: true
        }
        case LIVE_NOTIFICATION_SUCCESS:
        return {
            ...state,
            loading:false,
            isUpdated: action.payload.success
        }
        case LIVE_NOTIFICATION_FAIL:
        return {
            ...state,
            loading:false,
            error: action.payload
        }
        case LIVE_NOTIFICATION_RESET:
        return{
            ...state,
            isUpdated: false
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