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
} from '../constants/dashboardConstants'

export const usersTotalReducer = (state = { usersTotal: [] }, action) => {
    switch (action.type) {
        case TOTAL_USERS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case TOTAL_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                usersTotal: action.payload.usersTotal
            }
        case TOTAL_USERS_FAIL:
            return {
                ...state,
                loading: false,
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

export const dumpsTotalReducer = (state = { dumpsTotal: [] }, action) => {
    switch (action.type) {
        case TOTAL_DUMPS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case TOTAL_DUMPS_SUCCESS:
            return {
                ...state,
                loading: false,
                dumpsTotal: action.payload.dumpsTotal
            }
        case TOTAL_DUMPS_FAIL:
            return {
                ...state,
                loading: false,
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

export const donationsTotalReducer = (state = { donationsTotal: [] }, action) => {
    switch (action.type) {
        case TOTAL_DONATIONS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case TOTAL_DONATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                donationsTotal: action.payload.donationsTotal
            }
        case TOTAL_DONATIONS_FAIL:
            return {
                ...state,
                loading: false,
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

export const donatedItemsReducer = (state = { donatedItems: [] }, action) => {
    switch (action.type) {
        case DONATED_ITEMS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case DONATED_ITEMS_SUCCESS:
            return {
                ...state,
                loading: false,
                donatedItems: action.payload.donatedItems
            }
        case DONATED_ITEMS_FAIL:
            return {
                ...state,
                loading: false,
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

export const cleanedDumpsReducer = (state = { cleanedDumps: [] }, action) => {
    switch (action.type) {
        case CLEANED_DUMPS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case CLEANED_DUMPS_SUCCESS:
            return {
                ...state,
                loading: false,
                cleanedDumps: action.payload.cleanedDumps
            }
        case CLEANED_DUMPS_FAIL:
            return {
                ...state,
                loading: false,
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

export const uncleanedDumpsReducer = (state = { uncleanedDumps: [] }, action) => {
    switch (action.type) {
        case UNCLEANED_DUMPS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case UNCLEANED_DUMPS_SUCCESS:
            return {
                ...state,
                loading: false,
                uncleanedDumps: action.payload.uncleanedDumps,
                AllDumps: action.payload.AllDumps
            }
        case UNCLEANED_DUMPS_FAIL:
            return {
                ...state,
                loading: false,
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

export const wasteCollectionPerTruckReducer = (state = { collectionPerTruck: [] }, action) => {
    switch (action.type) {
        case WASTE_COLLECTION_PER_TRUCK_REQUEST:
            return {
                ...state,
                loading: true
            }
        case WASTE_COLLECTION_PER_TRUCK_SUCCESS:
            return {
                ...state,
                loading: false,
                collectionPerTruck: action.payload.collectionPerTruck
            }
        case WASTE_COLLECTION_PER_TRUCK_FAIL:
            return {
                ...state,
                loading: false,
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


export const collectionPointDashReducer = (state = { collectionPoint: [] }, action) => {
    switch (action.type) {
        case COLLECTION_POINT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case COLLECTION_POINT_SUCCESS:
            return {
                ...state,
                loading: false,
                collectionPoint: action.payload.collectionPoint
            }
        case COLLECTION_POINT_FAIL:
            return {
                ...state,
                loading: false,
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

export const reportsPerCategoryReducer = (state = { reportsPerCategory: [] }, action) => {
    switch (action.type) {
        case REPORT_PER_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true
            }
        case REPORT_PER_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                reportsPerCategory: action.payload.reportsPerCategory
            }
        case REPORT_PER_CATEGORY_FAIL:
            return {
                ...state,
                loading: false,
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

export const donationsPerCategoryReducer = (state = { donationsPerCategory: [] }, action) => {
    switch (action.type) {
        case DONATION_PER_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true
            }
        case DONATION_PER_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                donationsPerCategory: action.payload.donationsPerCategory
            }
        case DONATION_PER_CATEGORY_FAIL:
            return {
                ...state,
                loading: false,
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
