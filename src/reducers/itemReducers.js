import {
    ITEM_LIST_REQUEST,
    ITEM_LIST_SUCCESS, 
    ITEM_LIST_FAIL,

    ADD_ITEM_REQUEST,
    ADD_ITEM_SUCCESS,
    ADD_ITEM_RESET,
    ADD_ITEM_FAIL,

    CLAIM_ITEM_REQUEST,
    CLAIM_ITEM_SUCCESS,
    CLAIM_ITEM_RESET,
    CLAIM_ITEM_FAIL,

    CANCEL_ITEM_REQUEST,
    CANCEL_ITEM_SUCCESS,
    CANCEL_ITEM_RESET,
    CANCEL_ITEM_FAIL,

    CONFIRM_ITEM_REQUEST,
    CONFIRM_ITEM_SUCCESS,
    CONFIRM_ITEM_RESET,
    CONFIRM_ITEM_FAIL,

    RECEIVE_ITEM_REQUEST,
    RECEIVE_ITEM_SUCCESS,
    RECEIVE_ITEM_RESET,
    RECEIVE_ITEM_FAIL,
    
    ALL_ITEMS_REQUEST,
    ALL_ITEMS_SUCCESS, 
    ALL_ITEMS_FAIL,

    ITEM_DETAILS_REQUEST,
    ITEM_DETAILS_SUCCESS,
    ITEM_DETAILS_FAIL,

    NEW_ITEM_REQUEST,
    NEW_ITEM_SUCCESS,
    NEW_ITEM_RESET, 
    NEW_ITEM_FAIL,

    UPDATE_ITEM_REQUEST,
    UPDATE_ITEM_SUCCESS,
    UPDATE_ITEM_RESET,
    UPDATE_ITEM_FAIL,

    DELETE_ITEM_REQUEST,
    DELETE_ITEM_SUCCESS,
    DELETE_ITEM_RESET,
    DELETE_ITEM_FAIL,

    CLEAR_ERRORS 
} from '../constants/itemConstants'

export const itemsReducer = (state = { items:[] }, action) => {
    switch(action.type) {
        case ITEM_LIST_REQUEST:
        case ALL_ITEMS_REQUEST:
        return {
            ...state,
            loading: true
        }
        case ITEM_LIST_SUCCESS:
        case ALL_ITEMS_SUCCESS:
        return {
            ...state,
            loading:false,
            items: action.payload.items,
            itemsCount: action.payload.itemsCount,
            filteredItemCount: action.payload.filteredItemCount,
            resPerPage: action.payload.resPerPage
        }
        case ITEM_LIST_FAIL:
        case ALL_ITEMS_FAIL:
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

export const itemReducer = (state = {}, action) => {
    switch (action.type) {

        case CLAIM_ITEM_REQUEST:
        case CANCEL_ITEM_REQUEST:
        case CONFIRM_ITEM_REQUEST:
        case RECEIVE_ITEM_REQUEST:
        case DELETE_ITEM_REQUEST:
        case UPDATE_ITEM_REQUEST:
            return {
                ...state,
                loading: true
            }

        case CLAIM_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                isClaimed: action.payload
            }

        case CANCEL_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                isCanceled: action.payload
            }

        case CONFIRM_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                isConfirmed: action.payload
            }

        case RECEIVE_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                isReceived: action.payload
            }

        case DELETE_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }

        case CLAIM_ITEM_FAIL:
        case CANCEL_ITEM_FAIL:
        case CONFIRM_ITEM_FAIL:
        case RECEIVE_ITEM_FAIL:
        case DELETE_ITEM_FAIL:
        case UPDATE_ITEM_FAIL:
            return {
                ...state,
                error: action.payload
            }            

        case CLAIM_ITEM_RESET:
            return {
                ...state,
                isClaimed: false
            }

        case CANCEL_ITEM_RESET:
            return {
                ...state,
                isCanceled: false
            }

        case CONFIRM_ITEM_RESET:
            return {
                ...state,
                isConfirmed: false
            }

        case RECEIVE_ITEM_RESET:
            return {
                ...state,
                isReceived: false
            }
            
        case DELETE_ITEM_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_ITEM_RESET:
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

export const itemDetailsReducer = (state = { item: {} }, action) => {
    switch (action.type) {
        case ITEM_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case ITEM_DETAILS_SUCCESS:
            return {
                loading: false,
                item: action.payload.item,
                receiver: action.payload.receiver
            }
        case ITEM_DETAILS_FAIL:
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

export const newItemReducer = (state = { item: {} }, action) => {
    switch (action.type) {

        case ADD_ITEM_REQUEST:
        case NEW_ITEM_REQUEST:
            return {
                ...state,
                loading: true
            }

        case ADD_ITEM_SUCCESS:
        case NEW_ITEM_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                item: action.payload.item
            }

        case ADD_ITEM_FAIL:
        case NEW_ITEM_FAIL:
            return {
                ...state,
                error: action.payload
            }
        
        case ADD_ITEM_RESET:
        case NEW_ITEM_RESET:
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